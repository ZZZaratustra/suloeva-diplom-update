import dgram from 'node:dgram'
import fs from 'fs'
import { json } from 'stream/consumers'
// import fs from 'fs/promises'

const getArr = () => {
  let arr = []
  for (let i =0 ; i < 100000; i++) {
    arr.push(i)
  }
  console.log(arr.join('').length);
  return fs.writeFileSync ('text.txt', arr.toString())
}
getArr()

// fs.readFileSync ()

const server = dgram.createSocket('udp4')
const client = dgram.createSocket('udp4')
server.on('error', (error)=>{
    console.log("error:",error)
    server.close()
})

server.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  });
  
  
  server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
  });
  
  server.bind(3000, () => {
    const size = server.getSendBufferSize()
    console.log(size)
  });
  // Prints: server listening 0.0.0.0:41234
  
  const readTxt = async (text) => {
    let counter = 0;
    const txt = await fs.createReadStream(text, {
      encoding: 'utf8',
      start: 0,
      //  end:1000,
      highWaterMark: 1024
    })
    
    
    let a = () => txt.on('data', async (chunk) => {
      console.log(chunk)
      // const data = json.stringify({
      //   counter,
      //   text: Buffer.from(chunk).toString(),
      // });
      
      // counter += 1;
      
      // if (counter === 10) {
      //    return
      // }
      
  
      // console.log(chunk/* ,'chunk length:', chunk.length */) 
      let chunks = await client.send(Buffer.from(chunk), 3000)
      console.log(chunks)
     return chunks/* client.send(Buffer.from(chunk), 3000) */
    })

    return a()
  }
    readTxt('text.txt')
  
  console.log("fs.stat.size:",fs.statSync('text.txt').size)
  
  