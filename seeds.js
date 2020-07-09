/*jshint esversion: 8 */

// creates a bunch (40) of fake post all by same author

const faker = require('faker');
const Post = require('./models/post');

async function seedPosts() {
  // await Post.remove({});
  // async so needs for-of loop
  for (const i of new Array(40)) {
    const post = {
      title: faker.lorem.word(),
      description: faker.lorem.text(),
      author: {
      	'_id' : '5eff6793e7f26811e848ceb1',
      	'username' : 'mike'
        }
    };
    await Post.create(post);
  }
  console.log('40 new posts created with seeds.js');
}

module.exports = seedPosts;
