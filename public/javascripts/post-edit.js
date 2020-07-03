/*jshint esversion: 6 */

// find the post edit form by its ID

let postEditForm = document.getElementById('postEditForm');

// add submit listener to the form

postEditForm.addEventListener('submit', function(event){

  // find how many images user is attempting upload

  let imageUploads = document.getElementById('imageUpload').files.length;

  // find how many images post already has

  let existingImages = document.querySelectorAll('.imageDeleteCheckbox').length;

  // calculate total number deletions

  let imgDeletions = document.querySelectorAll('.imageDeleteCheckbox:checked').length;

  // calculate the total images after adds and removals

  let newTotal = existingImages - imgDeletions + imageUploads;

  // calculate if the form can be submitted (if images <5) or not (if images >=5)

  if(newTotal  > 4){

    // stop the form submit

    event.preventDefault();

    // calculate the amount of images over 4

     let overspill = newTotal - 4;

     // explain the limit and the images needed to be removed to user

    alert(`Max 4 images allowed so please remove${overspill !== 1 ? ' at least' : ''} ${overspill} more image${overspill !== 1 ? 's' : ''} to do that.`);
  }

  // otherwise submit

});
