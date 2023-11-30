"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  location.reload();
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  $favoriteStoriesList.hide();
  $myStoryList.hide();
  $userProfile.hide();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $userProfile.hide();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function showSubmissionForm(){
  $favoriteStoriesList.hide();
  $myStoryList.hide();
  $userProfile.hide();
  $allStoriesList.show();
  if($submissionForm.is(":visible")){
    $submissionForm.slideUp("slow");
  } else{
    $submissionForm.slideDown("slow");
  }
}

$navSubmit.on("click", showSubmissionForm);

async function showFavorites(){
  $allStoriesList.hide();
  $myStoryList.hide();
  $userProfile.hide();
  $favoriteStoriesList.show();
  $submissionForm.slideUp("slow");

  if(!$favoriteStoriesList.find("li").length){
    $favoriteStoriesList.html("<h5>No favorites added!</h5>")
  } else{
    $favoriteStoriesList.find("h5").remove();
  }
}

$navFavorite.on("click", showFavorites);

async function showOwnStories(){
  $allStoriesList.hide();
  $favoriteStoriesList.hide();
  $userProfile.hide();
  $myStoryList.show();
  $submissionForm.slideUp("slow");

  if(!$myStoryList.find("li").length){
    $myStoryList.html("<h5>No stories added by user yet!</h5>");
  } else{
    $myStoryList.find("h5").remove();
  }
}

$navMyStories.on("click", showOwnStories);

async function showUserProfile(){
  $allStoriesList.hide();
  $favoriteStoriesList.hide();
  $submissionForm.hide();
  $myStoryList.hide();
  $userProfile.show();
  if(currentUser){
    $userProfile.html(`
    <div><b>Name:</b> ${currentUser.name}</div>
    <br>
    <div><b>Username:</b> ${currentUser.username}</div>
    <br>
    <div><b>Account Created:</b> ${(currentUser.createdAt).slice(0,10)}</div>`)
  }
}

$navUserProfile.on("click", showUserProfile);