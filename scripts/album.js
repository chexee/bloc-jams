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
      $('.main-controls .play-pause').html(playerBarPauseButton);
      setSong(songNumber);
      currentSoundFile.play();
      updatePlayerBarSong();
    } else {
      if(currentSoundFile.isPaused()) {
        $(this).html($pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
      } else if( !currentSoundFile.isPaused() ) {
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

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    var seekBarFillRatio = offsetX / barWidth;
    updateSeekPercentage($(this), seekBarFillRatio);
  });
};

var setSong = function(songNumber){
  if(currentSoundFile) {
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: ['mp3'],
    preload: true
  });
  setVolume(currentVolume);
}

var setVolume = function(volume){
  if(currentSoundFile){
    currentSoundFile.setVolume(volume);
  }
};

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
  $('.currently-playing .total-time').text(currentSongFromAlbum.length);
  $('.currently-playing .artist-song-mobile').text(currentAlbum.artist + ' - ' + currentSongFromAlbum.name);
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
  $('.main-controls .play-pause').html(playerBarPauseButton);

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
  $('.main-controls .play-pause').html(playerBarPauseButton);

  $getSongNumberCell(prevSongNumber).html(prevSongNumber);
  $getSongNumberCell(currentlyPlayingSongNumber).html($pauseButtonTemplate);
  updatePlayerBarSong();
}

// Player bar play/pause

var togglePlayFromPlayerBar = function(){
  if(currentSoundFile) {
  currentSoundFile.togglePlay();
  if(currentSoundFile.isPaused()) {
    $('.main-controls .play-pause').html(playerBarPlayButton);
    $getSongNumberCell(currentlyPlayingSongNumber).html($playButtonTemplate);
  } else if(!currentSoundFile.isPaused()) {
    $('.main-controls .play-pause').html(playerBarPauseButton);
    $getSongNumberCell(currentlyPlayingSongNumber).html($pauseButtonTemplate);
  }
}
}

// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;


var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');

$(document).ready (function() {
  var albums = [albumPicasso, albumMarconi, albumRothko]

  setCurrentAlbum(albumPicasso);
  setupSeekBars();

  $previousButton.click(prevSong);
  $nextButton.click(nextSong);
  $playPauseButton.click(togglePlayFromPlayerBar);


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
