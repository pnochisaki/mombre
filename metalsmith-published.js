module.exports = plugin;

function plugin(){
  return function(files, metalsmith, done){
    setImmediate(done);
    Object.keys(files).forEach(function(file){
      var data = files[file];
      if (data.published!=true && (data.collection=='posts' || data.collection=='pages')) delete files[file];
    });
  };
}