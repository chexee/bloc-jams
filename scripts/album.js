// Create album objects

var albumPicasso = {
  name: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs: [
    { name: 'Blue',     length: '4:26' },
    { name: 'Green',    length: '3:14' },
    { name: 'Red',      length: '5:01' },
    { name: 'Pink',     length: '3:21' },
    { name: 'Magenta',  length: '2:15' }
  ]
};

var albumMarconi = {
  name: 'The Telephone',
  artist: 'Guglielmo Marconi',
  label: 'EM',
  year: '1909',
  albumArtUrl: 'assets/images/album_covers/20.png',
  songs: [
    { name: 'Hello, Operator?',     length: '1:01'  },
    { name: 'Ring, ring, ring',     length: '5:01'  },
    { name: 'Fits in your pocket',  length: '3:21'  },
    { name: 'Can you hear me now?', length: '3:14'  },
    { name: 'Wrong phone number',   length: '2:15'  }
  ]
};

var albumRothko = {
  name: 'Color Numbers',
  artist: 'Mark Rothko',
  label: 'Multiforms',
  year: '1949',
  albumArtUrl: 'assets/images/album_covers/20.png',
  songs: [
    { name: 'Rust and orange',                  length: '2:31'  },
    { name: 'Magenta, Black, Green on Orange',  length: '3:41'  },
    { name: 'Four darks in red',                length: '1:27'  },
    { name: 'Black on Grey',                    length: '2:16'  },
    { name: 'White center',                     length: '3:24'  }
  ]
};

var createSongRow = function(songNumber, songName, songLength) {
  var template =
      '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" align="center" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

  return template;
}

// Display current albums

var setCurrentAlbum = function(album) {
  var albumTitle = document.getElementsByClassName('album-view-title')[0];
  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

  albumTitle.firstChild.nodeValue = album.name;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);

  albumSongList.innerHTML = '';

  for (var i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
  };

};

// Find a parent by its class name

var findParentByClassName = function(childElement, parentClassName){
  var currentElement = childElement;
  if ( !childElement.parentElement ) {
    alert('No parent found');
    return;
  }

  while( currentElement.className !== parentClassName ) {
    if ( !currentElement.parentElement ) {
      alert('No parent found with that class name');
      return;
    }
    currentElement = currentElement.parentElement;
  }
  return currentElement;
}

// Get the song item number

var getSongItem = function(element) {
  switch(element.className) {
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause':
      return findParentByClassName(element, 'song-item-number');
    case 'album-view-song-item':
      return element.querySelector('.song-item-number');
    case 'song-item-title':
    case 'song-item-duration':
      return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
    case 'song-item-number':
      return element;
    default:
      return;
  }
}

// Click handler

var clickHandler = function(targetElement) {
  var songItem = getSongItem(targetElement);

  if (currentlyPlayingSong === null ){
    songItem.innerHTML = pauseButtonTemplate;
    currentlyPlayingSong = songItem.getAttribute('data-song-number');
  } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
    songItem.innerHTML = playButtonTemplate;
    currentlyPlayingSong = null;
  } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
    var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
    currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
    songItem.innerHTML = pauseButtonTemplate;
    currentlyPlayingSong = songItem.getAttribute('data-song-number');
  }

};

// Show play button
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
// Show pause button
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
var currentlyPlayingSong = null;

window.onload = function() {
  var albums = [albumPicasso, albumMarconi, albumRothko]
  var currentAlbum = albumPicasso;
  var coverArt = document.getElementsByClassName('album-cover-art')[0]

  setCurrentAlbum(currentAlbum);

  coverArt.addEventListener( 'click', function(){
    var i = albums.indexOf(currentAlbum);
    var nextAlbum;

    if (i === albums.length - 1) {
      nextAlbum = albums[0];
    } else {
      nextAlbum = albums[i + 1];
    }

    setCurrentAlbum(nextAlbum);
    currentAlbum = nextAlbum;
  });

  var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
  var songRows = document.getElementsByClassName('album-view-song-item');

  songListContainer.addEventListener('mouseover', function(event) {
    var songItem = getSongItem(event.target);
    var songItemNumber = songItem.getAttribute('data-song-number');

    if (event.target.parentElement.className === 'album-view-song-item' && songItemNumber !== currentlyPlayingSong) {
      songItem.innerHTML = playButtonTemplate;
    }

  });

  for( i = 0; i < songRows.length; i++ ) {
    songRows[i].addEventListener('mouseleave', function(event){
      var songItem = getSongItem(event.target);
      var songItemNumber = songItem.getAttribute('data-song-number');

      if (songItemNumber !== currentlyPlayingSong) {
         songItem.innerHTML = songItemNumber;
      }
    });

    songRows[i].addEventListener('click', function(event){
      clickHandler(event.target);
    });
  }

};
