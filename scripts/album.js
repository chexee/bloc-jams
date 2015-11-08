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

// Store state of playing songs
var currentlyPlayingSong = null;

var createSongRow = function(songNumber, songName, songLength) {
  var template =
      '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" align="center" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

  var $row = $(template);

  // Show play button
  var $playButtonTemplate = function(){
    var template =  '<a class="album-song-button"><span class="ion-play"></span></a>';
    return $(template);
  };
  // Show pause button
  var $pauseButtonTemplate = function(){
    var template = '<a class="album-song-button"><span class="ion-pause"></span></a>';
    return $(template);
  };

  var onHover = function() {
    var $songItemNumberCell = $(this).find('.song-item-number')
    var songNumber = $songItemNumberCell.attr('data-song-number');

    if ( songNumber !== currentlyPlayingSong) {
      $songItemNumberCell.html($playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var $songItemNumberCell = $(this).find('.song-item-number')
    var songNumber = $songItemNumberCell.attr('data-song-number');

    if (songNumber !== currentlyPlayingSong) {
       $songItemNumberCell.text(songNumber);
    }
  };

  var clickHandler = function(){
    var songNumber = $(this).attr('data-song-number');
    var $currentlyPlayingSongCell = $('.song-item-number[data-song-number=' + currentlyPlayingSong + ']');

    if(songNumber !== currentlyPlayingSong) {
      if(currentlyPlayingSong !== null ) {
        $currentlyPlayingSongCell.text(currentlyPlayingSong);
      }
      $(this).html($pauseButtonTemplate);
      currentlyPlayingSong = songNumber;
    } else {
      $(this).html($playButtonTemplate);
      currentlyPlayingSong = null;
    }
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
};

// Display current albums

var setCurrentAlbum = function(album) {
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.name);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
    $albumSongList.append($newRow);
  };

};

$(document).ready (function() {
  var albums = [albumPicasso, albumMarconi, albumRothko]
  var currentAlbum = albumPicasso;

  setCurrentAlbum(currentAlbum);

  $coverArt.click(function(){
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
});
