"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  let confirmFavorite;
  if(currentUser){
    confirmFavorite = currentUser.isFavorite(story) ? "fas" : "far"
  }
  
  return $(`
      <li id="${story.storyId}">
      ${currentUser.isUsersStory(story) ? `<span class="trash-can"><i class="fas fa-trash-alt"></i></span>`: ""}
      ${currentUser ? `<span class='star'><i class='${confirmFavorite} fa-star'></i></span>`: ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  $favoriteStoriesList.empty();
  $myStoryList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  for(let fav of currentUser.favorites){
    const $story = generateStoryMarkup(fav);
    $favoriteStoriesList.append($story);
  }

  for(let ownStory of currentUser.ownStories){
    const $story = generateStoryMarkup(ownStory);
    $myStoryList.append($story);
  }

  $allStoriesList.show();
  $favoriteStoriesList.hide();
  $myStoryList.hide();
}

async function submitStory(){
  const story = await storyList.addStory(currentUser, {title:$title.val(), author:$author.val(),url:$url.val()});
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  $myStoryList.prepend($story);
  location.reload()
}

$submitButton.on("click", submitStory)

async function favoriteButtonPressed(evt){
  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(x => x.storyId === storyId);

  $target.toggleClass("fas");
  $target.toggleClass("far");

  if($target.hasClass("fas")){
    currentUser.addFavorite(story);
    $favoriteStoriesList.append(generateStoryMarkup(story));
  } else{
    currentUser.removeFavorite(story);
    $favoriteStoriesList.find(`#${storyId}`).remove();
    $(`#${storyId}.star i`).toggleClass("far");
    if(!$favoriteStoriesList.find("li").length){
      $favoriteStoriesList.append("<h5>No favorites added!</h5>");
    } else{
      $favoriteStoriesList.find("h5").remove();
    }
  }

}

$body.on("click", ".star", favoriteButtonPressed);

async function deleteButtonPressed(evt){
  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(x => x.storyId === storyId);

  storyList.removeStory(currentUser, storyId);
  $closestLi.remove();

  if(!$myStoryList.find("li").length){
    $myStoryList.append("<h5>No stories added by user yet!</h5>");
  } else{
    $myStoryList.find("h5").remove();
  }
}

$body.on("click", ".trash-can", deleteButtonPressed);