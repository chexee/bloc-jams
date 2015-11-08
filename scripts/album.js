var createSongRow = function(songNumber, songName, songLength) {
  var template =
      '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" align="center" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

  var $row = $(template);

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

  var onHover = function() {
    var $songItemNumberCell = $(this).find('.song-item-number')
    var songNumber = $songItemNumberCell.attr('data-song-number');

    if ( songNumber !== currentlyPlayingSongNumber) {
      $songItemNumberCell.html($playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var $songItemNumberCell = $(this).find('.song-item-number')
    var songNumber = $songItemNumberCell.attr('data-song-number');

    if (songNumber !== currentlyPlayingSongNumber) {
       $songItemNumberCell.text(songNumber);
    }
  };

  var clickHandler = function(){
    var songNumber = $(this).attr('data-song-number');
    var $currentlyPlayingSongCell = $('.song-item-number[data-song-number=' + currentlyPlayingSongNumber + ']');

    if(songNumber !== currentlyPlayingSongNumber) {
      if(currentlyPlayingSongNumber !== null ) {
        $currentlyPlayingSongCell.text(currentlyPlayingSongNumber);
      }

      $(this).html($pauseButtonTemplate);
      currentlyPlayingSongNumber = songNumber;
      currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
      updatePlayerBarSong();
    } else {
      $(this).html($playButtonTemplate);
      $('.main-controls .play-pause').html(playerBarPlayButton);
      currentlyPlayingSongNumber = null;
      currentSongFromAlbum = null;
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

// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

$(document).ready (function() {
  var albums = [albumPicasso, albumMarconi, albumRothko]

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
