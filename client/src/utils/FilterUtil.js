module.exports = function filterfunction(JSONresult, videoCreatorComRep, wordFilter,
  likesFilter, dateFilter, nameFilter) {

  // Filter each result array item - where each item is a comment thread
  JSONresult = JSONresult.filter(OPpost => {
    /* Should the thread be displayed?
      Execution will go through a series of tests, where display will be switched to 'false' if a thread doesn't meet our criteria
    */
    var display = true;

    /* Does the OP post match all filter criteria?
      If it does match, the object 'OPpost' will have the property 'filter' that is 'true'
      Inside CommentSection component - OPpost.filter = true causes "finder" to be defined as a className
    */

    // If video creator filter is on, should we display this post?
    if (videoCreatorComRep && display) {
      if (!OPpost.isCreator) {
        display = false;
        OPpost.filter = false;
      } else {
        OPpost.filter = true;
      };
    };

    // If word filter is on, should we display this post?
    if (wordFilter && display) {
      if (!OPpost.comment.toLowerCase().includes(wordFilter)) {
        display = false;
        OPpost.filter = false;
      } else {
        OPpost.filter = true;
      };
    };

    // If likes filter is on, should we display this post?
    if (likesFilter && display) {
      var OPlikes = OPpost.likes;
      // For OP posts that have over 1,000 likes (ex: 1K or 1.2K), correctly display number form
      if (OPlikes.includes('K')) {
        if (OPlikes.includes('.')) {
          OPlikes = Number(OPlikes.replace('.', '').replace('K', '00'));
        } else {
          OPlikes = Number(OPlikes.replace('K', '000'));
        };
      };

      if (OPlikes < likesFilter) {
        display = false;
        OPpost.filter = false;
      } else {
        OPpost.filter = true;
      };
    };

    // If date filter is on, should we display this post?
    if (dateFilter && display) {
      for (let i = 0; i < dateFilter.length; i++) {
        if (!OPpost.date.includes(dateFilter[i])) {
          display = false;
          OPpost.filter = false;
        } else {
          OPpost.filter = true;
          // if the 2nd item of the array is found in the date, make display 'true'
          display = true;
          break;
        };
      };
    };

    // If name filter is on, should we display this post?
    if (nameFilter && display) {
      if (OPpost.name.toLowerCase() !== nameFilter.trim()) {
        display = false;
        OPpost.filter = false;
      } else {
        OPpost.filter = true;
      };
    };

    // if we passed all of the "OP post" filters, display the thread - no matter the reply filter outcome
    if (display) {
      OPpost.display = true;
    };

    // If we have not passed all of the "OP post" filters, we will still continue on
    // If a minimum of one reply meets the filter criteria, we will return the thread

    // Filter through replies
    function PostReplies(OPpost, display) {

      // Should this reply be displayed?
      var repDisplay = false;

      // 'if' check - if replies exist for this particular comment thread
      if (OPpost.replies.length > 0) {
        const replyPost = OPpost.replies;

        // If filter finds one reply that meets ALL criteria, display the whole thread
        // If reply meets all criteria, have a 'filter' property evaluated to 'true'

        for (let i = 0; i < replyPost.length; i++) {
          display = true;
          if (videoCreatorComRep) {
            if (!replyPost[i].isCreatorRep) {
              display = false;
              replyPost[i].filter = false;
            } else {
              display = true;
              replyPost[i].filter = true;
            };
          };

          if (wordFilter && display) {
            if (!replyPost[i].reply.toLowerCase().includes(wordFilter)) {
              display = false;
              replyPost[i].filter = false;
            } else {
              display = true;
              replyPost[i].filter = true;
            };
          };

          if (likesFilter && display) {
            var repLikes = replyPost[i].likesRep;
            // // For replies that have over 1,000 likes (ex: 1K or 1.2K), correctly display number form
            if (repLikes.includes('K')) {
              if (repLikes.includes('.')) {
                repLikes = Number(repLikes.replace('.', '').replace('K', '00'));
              } else {
                repLikes = Number(repLikes.replace('K', '000'));
              };
            };

            if (repLikes < likesFilter) {
              display = false;
              replyPost[i].filter = false;
            } else {
              display = true;
              replyPost[i].filter = true;
            };
          };

          if (dateFilter && display) {
            for (let j = 0; j < dateFilter.length; j++) {
              if (!replyPost[i].dateRep.includes(dateFilter[j])) {
                display = false;
                replyPost[i].filter = false;
              } else {
                display = true;
                replyPost[i].filter = true;
                break;
              };
            };
          };

          if (nameFilter && display) {
            if (replyPost[i].nameRep.toLowerCase() !== nameFilter.trim()) {
              display = false;
              replyPost[i].filter = false;
            } else {
              display = true;
              replyPost[i].filter = true;
            };
          };

          // If a particular reply has passed through all of the reply filters, display the thread
          if (display === true) {
            repDisplay = true;
          };
        };

        // If a reply is found to meet all criteria in the loop, the thread is allowed to be displayed
        if (repDisplay === true) {
          return repDisplay;
        };
      } else {
        // if no replies are found in this thread, use the same "display" value
        return display;
      };
    };

    // Reply filter checking
    const repDisplay = PostReplies(OPpost, display);
    // As long as the OP post or a particular reply meets the filter criteria, allow this item to be stored in the JSONresult array
    if (OPpost.display || repDisplay) {
      return OPpost;
    } else {
      // If neither OP post or any replies meet the criteria, do not display the comment thread
      return null;
    };
  });
  return JSONresult;
};