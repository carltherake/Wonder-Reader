var center = require('./js/centerfold.js');


var val = 2; // or -2 by defaults

function pageTurn(val) {
  var filePath = decodeURIComponent(document.getElementById('viewImgOne').src.substr(7)); // removes file:// from PATH
  var fileDir = path.dirname(filePath);
  var dirArray = fs.readdirSync(fileDir);
  var fileName = path.basename(filePath);
  var index = dirArray.indexOf(fileName);
  var centerFolds = center.fold('viewImgOne');
  var viewOne = document.getElementById("viewImgOne");
  var viewTwo = document.getElementById("viewImgTwo");

  var polarity = 1;
  if (val < 0) {
    var polarity = -1;
  };

  if (centerFolds.length == 0) {
    var index = index + val;
    if (index >= dirArray.length -1) {
      // If page number + 2 is greater or equal to the total number of pages, then it stops on the last page
      index = dirArray.length -1; // TODO: figure out this proper value
    } else if (index <= 0) {
      index = 0;
    }
    viewOne.src = path.join(fileDir, encodeURIComponent(dirArray[index])); // Loads array[x] into window // TODO : Causes errors, maybe change to (dirArray.length -1)?
    viewTwo.src = path.join(fileDir, encodeURIComponent(dirArray[index + 1])); // Loads array[x + 1] into window
  } else if (centerFolds.length == 1) { // For when a single CenterFold exists
    if (centerFolds[0] % 2 == 0) { // EVEN, assumes page turning right && two page turning
      if (index + val == centerFolds[0]) { //
        index = index + val;
        viewOne.src = path.join(fileDir, encodeURIComponent(dirArray[index]));
        viewOne.style.width = '100%';
        viewTwo.style.display = 'none';
      } else if (index == centerFolds[0]) { // For when actually on the centerFold
        index = index + 1*polarity;
        if (Math.abs(val) == 2) { // For when displaying 2 pages
          defaults()
        }
        viewOne.src = path.join(fileDir, encodeURIComponent(dirArray[index]));
        viewTwo.src = path.join(fileDir, encodeURIComponent(dirArray[index + 1]));
      }
    } else { // (centerFolds[0] % 2 == 1) :: ODD, assumes page turning right && two page turning
      // TODO: Display cover (dirArray[0]) as 100%;

      if (index == 0) {
      // For when displaying first page
        index = index + 1*polarity;
        viewOne.src = path.join(fileDir, encodeURIComponent(dirArray[index]));
        viewTwo.src = path.join(fileDir, encodeURIComponent(dirArray[index + 1]));
        if (Math.abs(val) == 2) { // For when displaying 2 pages
          defaults()
        };
      } else if (index + val == centerFolds[0] || index + val == 0) {
      // For when landing on either CenterFold or Cover

      /* TODO: Create checker to see what the length of images
      *  past CenterFolds[0] are and display last page as appropiate */

        index = index + val;
        viewOne.src = path.join(fileDir, encodeURIComponent(dirArray[index]));
        viewOne.style.width = '100%';
        viewTwo.style.display = 'none';
      } else if (index == centerFolds[0]) {
      // For when moving past the CenterFold
      // Maybe combine with previous 'if (index == 0)' statement

        index = index + 1*polarity;
        viewOne.src = path.join(fileDir, encodeURIComponent(dirArray[index]));
        viewTwo.src = path.join(fileDir, encodeURIComponent(dirArray[index + 1]));
        if (Math.abs(val) == 2) { // For when displaying 2 pages
          defaults()
        };
      } else {
        index = index + val
      }
    }
  } else { // For when centerFold has various values
    var diff = [centerFolds[0]];

    for (i=1; i < centerFolds.length; i++) {
      diff.push(centerFolds[i] - centerFolds[i-1])
    };

    console.log('centerFolds array : ' + centerFolds + ' with length: ' + centerFolds.length);
    console.log('diff array : ' + diff + ' with length: ' + diff.length);


  }
}

function defaults() { // For when displaying 2 pages
  document.getElementById('viewImgOne').style.width = '50%';
  document.getElementById('viewImgTwo').style.width = '50%';
  document.getElementById('viewImgOne').style.display = 'initial';
  document.getElementById('viewImgTwo').style.display = 'initial';
}