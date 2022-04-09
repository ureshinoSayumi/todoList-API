const http = require("http");
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./errorHandle');
const todos = [
    {
        title: 'ABC',
        id: uuidv4()
    }
]
const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    let body = ''
    req.on('data', chunk => {
        body += chunk
    })
    
    console.log(req.url, req.method)
    if (req.url == '/todos' && req.method == 'GET') {
        res.writeHead(200, headers)
        res.write(JSON.stringify({
            'status': 'sucess',
            'data': todos,
            'message': '取得成功'
        }))
        res.end()  
    } else if (req.url.startsWith('/todos/') && req.method == 'GET') {
        const id = req.url.split('/').pop()
        index = todos.findIndex(item => item.id == id)
        if (index !== -1) {
            res.writeHead(200, headers)
            res.write(JSON.stringify({
                'status': 'sucess',
                'data': todos[index],
                'message': '單筆取得成功'
            }))
            res.end() 
        } else {
            errorHandle(res, '單筆取得失敗，無此資料')
        }
    } else if (req.url == '/todos' && req.method == 'POST') {
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title
                if (title !== undefined) {
                    const todo = {
                        title: title,
                        id: uuidv4()
                    }
                    todos.push(todo)
                    console.log(todos)
                    res.writeHead(200, headers)
                    res.write(JSON.stringify({
                        'status': 'sucess',
                        'data': 'ssss',
                        'message': '傳送成功'
                    }))
                    res.end()
                } else {
                    errorHandle(res, '傳送失敗，格式錯誤')
                }
                
            } catch(error) {
                errorHandle(res)
            }
            
        })
        
    } else if (req.url == '/todos' && req.method == 'DELETE') {
        todos.length = 0
        res.writeHead(200, headers)
        res.write(JSON.stringify({
            'status': 'sucess',
            'data': todos,
            'message': '全部刪除成功'
        }))
        res.end()  
    } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
        const id = req.url.split('/').pop()
        index = todos.findIndex(item => item.id == id)
        if (index !== -1) {
            todos.splice(index, 1)
            res.writeHead(200, headers)
            res.write(JSON.stringify({
                'status': 'sucess',
                'data': todos,
                'message': '單筆刪除成功'
            }))
            res.end() 
        } else {
            errorHandle(res, '單筆刪除失敗，格式錯誤')
        }
    } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
        req.on('end', () => {
            
            try {
                const id = req.url.split('/').pop()
                const todo = JSON.parse(body).title
                const index = todos.findIndex(item => item.id == id )
                // 確認是否存在，是否有title屬性
                if (index !== -1 && todo !== undefined) {
                    todos[index].title = todo
                    res.writeHead(200, headers)
                    res.write(JSON.stringify({
                        'status': 'sucess',
                        'data': todos,
                        'message': '編輯成功'
                    }))
                    res.end()
                } else {
                    errorHandle(res, '編輯失敗，格式錯誤')
                }
                
            } catch(error) {
                errorHandle(res, '編輯失敗，格式錯誤')
            }
            
        })
    }
    else if (req.method == 'OPTIONS') {
        res.writeHead(200, headers)
        res.write(JSON.stringify({
            'status': 'sucess',
            'data': [],
        }))
        res.end()  
    } else {
        res.writeHead(404, headers)
        res.write(JSON.stringify({
            'status': 'false',
            'message': '無此路由',
        }))
        res.end()  
    }
    
}

const server = http.createServer(requestListener)
server.listen(8888);
// console.log('http://127.0.0.1:8888/');