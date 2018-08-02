/**
 * helper for doing POST / GET request to 
 * http://wombtest.getsandbox.com/
 */

// See Web-readme.txt for details of http://wombtest.getsandbox.com
// const API = 'http://test.nbbnets.net/pbc/public/api/app/'
const API = 'http://nbbnetsapp.getsandbox.com/'

class Web {

  // Helper for doing GET request
  get(action,callback){
    fetch(API+action)
    .then(response => response.json())
    .then(data => {
      callback(data);
    })
    .catch(err => {
      alert(err.message)
    })
  }

  // Helper for doing POST request
  post(action,data,callback){
    data = this.prepare(data)
    fetch(API+action,{
      method : 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', 
      },
      body : data
    })
    .then(response => response.json())
    .then(data => {
      callback(data);
    })
    .catch(err => alert(err.message))
  }

  // Translates object to URL query string, needed in post
  prepare(data){
    var str = "";
    for (var key in data) {
        if (str != "") {
            str += "&";
        }
        str += key + "=" + encodeURIComponent(data[key]);
    }
    return str
  }
}

module.exports = new Web()

