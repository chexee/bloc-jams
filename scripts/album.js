var createSongRow = function(songNumber, songName, songLength) {
  var template =
      '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" align="center" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

  var $row = $(template);

  var onHover = function() {
    var $songItemNumberCell = $(this).find('.song-item-number')
    var songNumber = parseInt($songItemNumberCell.attr('data-song-number'));

    if ( songNumber !== currentlyPlayingSongNumber) {
      $songItemNumberCell.html($playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var $songItemNumberCell = $(this).find('.song-item-number')
    var songNumber = parseInt($songItemNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
       $songItemNumberCell.text(songNumber);
    }


  };

  var clickHandler = function(){
    var songNumber = parseInt($(this).attr('data-song-number'));
    var $currentlyPlayingSongCell = $getSongNumberCell(currentlyPlayingSongNumber);

    if(currentlyPlayingSongNumber !== songNumber) {
      if(currentlyPlayingSongNumber !== null ) {
        $currentlyPlayingSongCell.text(currentlyPlayingSongNumber);
      }
      $(this).html($pauseButtonTemplate);
      setSong(songNumber);
      currentSoundFile.play();
      updatePlayerBarSong();
    } else {
      if(currentlySoundFile.isPaused()) {
        $(this).html($pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
      } else if( !currentlySoundFile.isPaused() ) {
        $(this).html($playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
      }
    }
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
};

// Display current albums

var setCurrentAlbum = function(album) {
  currentAlbum = album;

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

var setSong = function(songNumber){
  if(currentSoundFile) {
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioURL, {
    formats: ['mp3'],
    preload: true
  });
}

var $getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number=' + number + ']');
}

// Show play and pause button on song rows
var $playButtonTemplate = function(){
  var template =  '<a class="album-song-button"><span class="ion-play"></span></a>';
  return $(template);
};
var $pauseButtonTemplate = function(){
  var template = '<a class="album-song-button"><span class="ion-pause"></span></a>';
  return $(template);
};

// Show play and pause on the player bar
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Give us the index of a song given the album object and song object
var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

// Update Player Bar

var updatePlayerBarSong = function(){
  $('.currently-playing .song-name').text(currentSongFromAlbum.name);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentAlbum.artist + ' - ' + currentSongFromAlbum.name);

  $('.main-controls .play-pause').html(playerBarPauseButton);
};

// Play next song

var nextSong = function(){
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  var prevSongNumber = currentSongIndex + 1;

  if(currentSongIndex === currentAlbum.songs.length - 1) {
    currentSongIndex = 0;
  } else {
    currentSongIndex++;
  }

  setSong(currentSongIndex + 1);
  currentSoundFile.play();

  $getSongNumberCell(prevSongNumber).html(prevSongNumber);
  $getSongNumberCell(currentlyPlayingSongNumber).html($pauseButtonTemplate);
  updatePlayerBarSong();
}

// Play next song

var prevSong = function(){
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  var prevSongNumber = currentSongIndex + 1;

  if(currentSongIndex === 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  } else {
    currentSongIndex--;
  }

  setSong(currentSongIndex + 1);
  currentSoundFile.play();

  $getSongNumberCell(prevSongNumber).html(prevSongNumber);
  $getSongNumberCell(currentlyPlayingSongNumber).html($pauseButtonTemplate);
  updatePlayerBarSong();
}

// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;


var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready (function() {
  var albums = [albumPicasso, albumMarconi, albumRothko]

  setCurrentAlbum(albumPicasso);
  $previousButton.click(prevSong);
  $nextButton.click(nextSong);
  $('')


  $('.album-cover-art').click(function(){
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
