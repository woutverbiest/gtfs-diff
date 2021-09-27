const leveldown = require('leveldown')
const fs = require('fs')
const readline = require('readline');
require('dotenv').config()

var start_time = new Date();

var stayed = 0;
var new_connection = 0;
var updated = 0;
var removed = 0;

var requestparams={
    'old_file': 'old.json',
    'new_file': 'new.json',
}

db = leveldown("db")

db.open(()=>{writeInitial()})

async function writeInitial(){
    const fileStream = fs.createReadStream(`${storage}/${requestparams.old_file}`);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
  
    for await (const line of rl) {
        let k = line.split('"')
        let key = k[k.indexOf('@id')+2]

        db.put(key, line, ()=>{})
    }

    compare()
}

async function compare(){
    const fileStream = fs.createReadStream(`${storage}/${requestparams.new_file}`);

    const rl = readline.createInterface({
        input:fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        let k = line.split('"')
        let key = k[k.indexOf('@id')+2]

        db.put(key, line, ()=>{})

        db.get(key, {asBuffer : false}, (error, value)=>{

            if(error){
                new_connection++;
                fs.appendFile(new.json`${storage}/diff/new.json`, line + '\r\n', function (err) {
                    if (err) throw err;
                  });
            } else if(value != line){
                updated++;
                fs.appendFile(`${storage}/diff/updated.json`, line + '\r\n', function (err) {
                    if (err) throw err;
                  });
                
                db.del(key, ()=>{});
            } else {
                stayed++;
                db.del(key, ()=>{});
            }
        });
    }

    var iterator = db.iterator({valueAsBuffer:false,keyAsBuffer:false})

    iterate(iterator);
}

function time_difference(start_time){
    return  Math.round((new Date() - start_time) / 1000);
}

function iterate(iterator){

    // TODO this function should iterate over the remaining key value pairs in db and add them to a file containing the removed connections
//     iterator.next((error,key,value)=>{
//         //console.log(key)
//         if(error){
//             db.clear()

//             done()
//         } else {
//             fs.appendFile('removed.json', value + '\r\n', function (err) {
//                 if (err) throw err;
//               });

//               iterate(iterator)
//         }
//     });
    done();
}

function done(){
    console.log("stayed", stayed)
    console.log("new_connection", new_connection)
    console.log("updated",updated)
    console.log("removed", removed)

    console.log('done comparing (took ' + time_difference(start_time) + 's)')
}