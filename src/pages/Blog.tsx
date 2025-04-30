import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Heart, MessageCircle, Share2 } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Making a Difference: Restaurant Partners Impact',
      excerpt: 'Discover how our restaurant partners are revolutionizing street dog feeding programs through sustainable food sharing initiatives.',
      author: 'Sarah Johnson',
      date: 'March 15, 2024',
      image: 'https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg',
      category: 'Success Stories',
      readTime: '5 min read',
      likes: 245,
      comments: 18,
    },
    {
      id: 2,
      title: 'Milestone Achievement: 10,000 Meals Served',
      excerpt: 'Celebrating our latest milestone of serving 10,000 meals to street dogs. Learn about the impact and the stories behind the numbers.',
      author: 'Mike Peters',
      date: 'March 10, 2024',
      image: 'https://images.pexels.com/photos/1904105/pexels-photo-1904105.jpeg',
      category: 'Milestones',
      readTime: '4 min read',
      likes: 189,
      comments: 24,
    },
    {
      id: 3,
      title: 'Behind the Scenes: Our Delivery Heroes',
      excerpt: 'Meet the dedicated delivery partners who brave all weather conditions to ensure our furry friends never go hungry.',
      author: 'Alex Thompson',
      date: 'March 5, 2024',
      image: 'https://images.pexels.com/photos/4668425/pexels-photo-4668425.jpeg',
      category: 'Team Stories',
      readTime: '6 min read',
      likes: 156,
      comments: 12,
    },
  ];

  const featuredPost = {
    title: "Transforming Lives: One Meal at a Time",
    excerpt: "An in-depth look at how our initiative is making a lasting impact on street dog welfare and community engagement.",
    image: "https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg",
    author: "Emily Rodriguez",
    date: "March 18, 2024",
    readTime: "8 min read",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Featured Post */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[500px] overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src={featuredPost.image}
            alt={featuredPost.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-end pb-16">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white max-w-2xl"
          >
            <span className="inline-block bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Featured Story
            </span>
            <h1 className="text-4xl font-bold mb-4">{featuredPost.title}</h1>
            <p className="text-lg mb-6 text-gray-200">{featuredPost.excerpt}</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{featuredPost.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{featuredPost.date}</span>
              </div>
              <span>{featuredPost.readTime}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Stories</h2>
          <p className="text-xl text-gray-600">Updates from our community</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 group-hover:text-green-600 transition-colors duration-300">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-gray-500 hover:text-green-600 transition-colors">
                      <Heart className="h-5 w-5 mr-1" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-green-600 transition-colors">
                      <MessageCircle className="h-5 w-5 mr-1" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-green-600 transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                  <button className="flex items-center text-green-600 hover:text-green-700 transition-colors">
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors duration-300 shadow-lg inline-flex items-center">
            Load More Stories
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;