{{{
	"tags": ["node", "express", "javascript"]
}}}

# Making a simple blog engine in Node

Last week I realized I should really start blogging. I'm a software developer by trade and I've really started to love Javascript, so I thought: why the heck not? Lets start a blog about Javascript and lets see where it goes from there.

Of course, being a programmer has its share of bad habits. You can't *just* start writing, **of course** you have to write your own blog engine, that too in Node, duh!

After a week of pricrastination, and thinking of tons of *awesome* features that my blog would have like computationally generated images based off the post hash and code being typed live as the reader read through the post, I decided to cut the crap and just sit down and write my first post. That's what its all about right?

However, one significant problem came up. I don't know what to write about yet? Come on, cut me some slack, I'm new to this game?

At first I thought I'd write about the last week and how I procrastinated and all the awesome ideas I had which would probably never be implemented. Then I had an epiphany: The main goal of this blog is to teach me stuff I'd otherwise not learn, especially stuff that I don't understand fully, i.e. things I know how to use, but still feel a bit uncomfortable with because I don't understand them as much as I'd like to.

This isn't going to be a Javascript experts blog, but more like an everyday guy's blog who knows Javascript well enough, but wants to  experiment with all the cool stuff that's coming out every day.

# Why I'm not going with Wordpress, or any of the more robust blogging engines out there?

This is a learning blog, and I've never written a blog engine before. So, why the heck not?

# Why write the engine in node?

Again, why not? I love Javascript, and I have written a bit of Node code. Not enough to be comfortable with it yet, but I'd sure like to know more about it. There's something about Node's spartan nature that attracts me and makes my inner programmer feel all warm and fuzzy inside.

# but...

No more buts, lets get started on the blog engine. I can't publish this on my blog if I don't write the code (Well, *technically* I **can**, but don't wanna).

Ok, hmm... where do we start?

# Describe it first, dummy!

Oh ok, got it. What do we want from this engine once we're done?

Side note -- I don't even know what that means: 'blog engine'. I mean, **I'm** going to be the blog engine. Generating the content, paying for hosting, overcoming fears of ridicule and anonymity, even writing the darn code that makes up this 'blog engine'. It's so unfair that it gets called the engine.

No more side notes, lets get to the describing. Ok, so here's a rough sketch of what features I think the engine **should** have:

- All posts are going to be in markdown. Life's too short to be writing in html.
- Should support templates
- Should support [yaml](http://www.yaml.org) [front matter](http://jekyllrb.com/docs/frontmatter/) on top of markdown
- Serve static pages
- Dynamic home page

Some of the eventual features I'd **like to** have:

- Archive Page
- Archives filtered by tags, categories
- Search
- lasers! (No, this is a joke. Sorry to let you down 😔)

# Let's start

I'm not great at building the entire picture in my head. I work best with my hands and improvise as I go along. So, lets start building this thing out

As always, start off with

```
git init
```

The repository for this code will be [here](https://github.com/mutahhir/spartan).

After running the following commands:

```
npm install --save-dev gulp
npm install --save express
```

we get to finally write some javascript code.

<script src="https://gist.github.com/mutahhir/350efe14f84ce0492973.js"></script>

The code is very simple at the moment, here's what it does:

- Require the express library
- Create a new express instance
- Add some code to be executed when a browser navigates to the root path
- Start listening on port 3000 and log a message to let us know when the server has initialized

That's pretty much it to start.

# Lets serve up some files

Now, the [asper.me](http://asper.me) blog will be composed of a bunch of markdown files. Lets decide where to keep them. Lets package all of the non-server stuff under a folder called `blog`. Here's a sample directory structure that should work for now

```
- blog
  - posts (contains markdown files with content)
  - layouts (contains the html templates)
  - styles
	  - less
	  - css
  - img
  - js
```

We should re-use wherever possible (yes, yes... I can see the irony too), so lets use the excellent [html5 boilerplate](http://html5boilerplate.com) to kick start our templates. Place the files under the `blog` folder, adjusting the structure to the one specified above.

Lets try to serve the index.html file now when we hit `http://localhost:3000`.

<script src="https://gist.github.com/mutahhir/c84735e07ce4c1855f21.js"></script>

Here we're doing a couple of interesting things.

1. [fs](http://nodejs.org/api/fs.html#fs_file_system) and [path](http://nodejs.org/api/all.html#all_path) are Node libraries that are built in. They're very useful. Read up on their documentation to achieve node super powers.
2. `__dirname` is an automatic global that you get pre-populated with the current directory

If you've worked at all before with Node, you'd know that Node is all about the *callback*. What are callbacks, and why do we need them? Callbacks are basically functions that get called once a certain operation completes. For example, in the above code snippet, the callback function is called once the `fs.readFile` operation comples (i.e., the file was read). 

Node is *asynchronous*, meaning that you shouldn't expect a function to finish execution before the next one is called. This makes sense if you consider the kind of things we do with node. Let's take the two most common tasks we'll be doing in the blog engine:

- Reading files
- Getting requests / sending responses over http

All of these things are what you'd call I/O (or input/output) operations. You don't want your code blocked and waiting for these operations to complete or fail. So, what happens is that you can supply a function to be called once the operation is completed and then forget about it. I know its a different way to think about things, and it took me a while to get used to, but pretty soon you won't even notice it.

The last thing I'm going to do is allow the static assets, the stylesheets, images, and javascripts to be served properly using our server. This is very easy in Express. Here's how:

<script src="https://gist.github.com/mutahhir/2494bb6a17b413036e22.js"></script>

At this point in time, we have a very simple server that can serve up an html file and handle also serve up any javascript, css, images etc. that the html file needs to render.

I wanted to do more in this post, but I feel doing more will try to cram too much information into a single post. It won't be entertaining for me, and I'll miss a few opportunities of exploring in depth some of the technologies that I'll need to use.

Next up: [adding a templating engine and serving up some actual content](http://asper.me)