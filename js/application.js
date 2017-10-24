$(document).ready( function(){
  $('.language-select').on('change', function(event){
    $('.submit-button').prop('disabled', false);
  });
  $('.navbar').click(function(e) {
    $('.left-menu').toggleClass('display');
    $('.left-menu').animate({ scrollTop: 0 }, 1);
  });
});

function callAPI(fromForm, source) {
  setLoadContainer();
  $.ajax({
    url:
      "https://newsapi.org/v1/"+getURL(fromForm, source)+"&apiKey=6fb414b067f348ca827b076f5ecb30ba",
    method: "GET",
    error: function() {
      console.log("fucked");
    },
    success: function(data) {
      successAPI(data, fromForm);
    }
  });
}

function successAPI(data, fromForm){
  $('#articles-container').empty();
  if(fromForm && data.sources.length > 0)
    loadSources(data.sources);
  else if(!fromForm && data.articles.length > 0)
      displayArticles(data.articles);
  else
    emptyResult();  
}

function getURL(fromForm, source){
  var url = 'sources?language='+$('.language-select').val()+'&category='+$('.category-select').val();
  if(!fromForm)
    url = 'articles?source='+source;
  return url
}

function loadSources(sources){
  var currentSource = '';
  var icon = '<i class="fa fa-arrow-circle-right" aria-hidden="true"></i>';
  var $sourceContainer = $('.sources-container > ul');
  $sourceContainer.empty();
  $sourceContainer.off();
  for(var i=0; i<sources.length; i++){
    currentSource ='<li><button id="'+sources[i].id+'" class="item tablink" >'+sources[i].name+icon+'</button></li>';
    $sourceContainer.append(currentSource);
  }
  $sourceContainer.click(function(evt){
    if($(evt.target).is('button')){
      callAPI(false, $(evt.target).attr('id'));
      if($('.navbar').css('display') !=='none')
        $('.left-menu').toggleClass('display');
    }
  });
  $('.clear-button').prop('disabled', false);
}

function displayArticles(articles){
  var currentSource = '';
  var $articlesContainer = $('#articles-container');
  $articlesContainer.empty();
  for(var i=0; i<articles.length; i++){
    $articlesContainer.append(createArticle(articles[i]));
  }
}

function createArticle(currentArticle){
  var articleFormated = '<div class="article" >';
  articleFormated += '<h3>'+displayText(currentArticle.title)+'</h3>';
  articleFormated += '<div><div class="img-container">'+createImgContainer(displayText(currentArticle.urlToImage))+'</div>';
  articleFormated += '<p class="mt0">'+displayDate(currentArticle.publishedAt)+'</p>';
  articleFormated += '<p>'+displayText(currentArticle.description)+'</p></div></div>';
  return articleFormated;
}
function createImgContainer(src){
  if(src)
    return '<img class="article-img" src="'+src+'"></img>';
  else
    return '<img class="article-img nonIMG" src=""></img>';
}

function displayDate(date){
  if(date)
    return moment(date).format('DD/MM/YY');
  return '';
}

function displayText(text){
  return text ? text : '';  
}

function emptyResult(){
  $('.clear-button').prop('disabled', true);
  clearSources();
  var $articlesContainer = $('#articles-container');
  $articlesContainer.empty();
  $('.sources-container > ul').append('<h3>Empty Search</h3>');
}

function clearSources(){
  var $sourceContainer = $('.sources-container > ul');
  $sourceContainer.empty();
  $sourceContainer.off();
  $('.clear-button').prop('disabled', true); 
}

function setLoadContainer(){
  $('#articles-container').empty();
  $('#articles-container').append('<img id="loading-img" src="img/loading.gif">');
}