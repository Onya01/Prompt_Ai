// // 'use client';

// // import { useState, useEffect } from "react";
// // import PromptCard from "./PromptCard";

// // const PromptCardList = ({ data, handleTagClick }) => {
// //   return (
// //     <div className="mt-16 prompt_layout">
// //       {data.map((post) => (
// //         <PromptCard
// //          key={post._id}
// //          post={post}
// //          handleTagClick={handleTagClick}
// //         />
// //       ))}
// //     </div>
// //   )
// // }

// // const Feed = () => {
// //   const [searchText, setSearchText] = useState('');

// //   const [posts, setPosts] = useState([]);

// //   const handleSearchChange = (e) => {}

// //   useEffect(() => {
// //     const fetchPosts = async () => {
// //       const response = await fetch('/api/prompt');
// //       const data = await response.json();

// //       setPosts(data);
// //     }

// //     console.log(posts);

// //     fetchPosts();
// //   }, []);

// //   return (
// //     <section className="feed">
// //       <form className="relative w-full flex-center">
// //         <input 
// //          type="text"
// //          placeholder="Search for a tag or a username"
// //          value={searchText}
// //          onChange={handleSearchChange}
// //          required
// //          className="search_input peer"
// //         />
// //       </form>

// //       <PromptCardList
// //        data={posts}
// //        handleTagClick={() =>{}}
// //       />
// //     </section>
// //   );
// // }

// // export default Feed;

// 'use client';

// import { useState, useEffect } from "react";
// import PromptCard from "./PromptCard";

// const PromptCardList = ({ data, handleTagClick }) => {
//   return (
//     <div className="mt-16 prompt_layout">
//       {data.map((post) => (
//         <PromptCard
//           key={post._id}
//           post={post}
//           handleTagClick={handleTagClick}
//         />
//       ))}
//     </div>
//   )
// }

// const Feed = () => {
//   const [searchText, setSearchText] = useState('');
//   const [posts, setPosts] = useState([]);

//   const handleSearchChange = (e) => {
//     setSearchText(e.target.value);
//   }

//   useEffect(() => {
//     const fetchPosts = async () => {
//       const response = await fetch('/api/prompt');
//       const data = await response.json();

//       setPosts(data);
//     }

//     fetchPosts();
//   }, []);

//   // Search by ID
//   const searchById = (id) => {
//     return posts.filter((post) => post._id === id);
//   }

//   // Search by Tag
//   const searchByTag = (tag) => {
//     return posts.filter((post) => post.tags.includes(tag));
//   }

//   // Search by Username
//   const searchByUsername = (username) => {
//     return posts.filter((post) => {
//       return (
//         post.username &&
//         post.username.toLowerCase() === username.toLowerCase()
//       );
//     });
//   }

//   // Apply the appropriate search based on searchText format
//   const filteredPosts = searchText.trim().startsWith('#')
//     ? searchByTag(searchText.trim().substring(1))
//     : searchText.trim().length === 24 && searchText.match(/^[0-9a-fA-F]+$/)
//     ? searchById(searchText.trim())
//     : searchByUsername(searchText.trim());

//   return (
//     <section className="feed">
//       <form className="relative w-full flex-center">
//         <input 
//           type="text"
//           placeholder="Search for a tag, username, or ID"
//           value={searchText}
//           onChange={handleSearchChange}
//           required
//           className="search_input peer"
//         />
//       </form>

//       <PromptCardList
//         data={posts}
//         handleTagClick={() => {}}
//       />
//     </section>
//   );
// }

// export default Feed;


"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();

    setAllPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>

      {/* All Prompts */}
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;