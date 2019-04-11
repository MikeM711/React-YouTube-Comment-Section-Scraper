
module.exports = function filterfunction(JSONresult, videoCreatorComRep, wordFilter,
  likesFilter, dateFilter, nameFilter) {
  JSONresult = JSONresult.filter(OPpost => {

    var display = true

    if (videoCreatorComRep && display) {
      if (!OPpost.isCreator) {
        display = false
        OPpost.filter = false
        // future: we will continue and see if replies have any creator comments
      } else {
        OPpost.filter = true
      }
    }

    if (wordFilter && display) {
      if (!OPpost.comment.toLowerCase().includes(wordFilter)) {
        display = false // future: we will continue, no null
        OPpost.filter = false
      } else {
        OPpost.filter = true
      }
    }

    if (likesFilter && display) {
      if (OPpost.likes < likesFilter) {
        display = false // future: we will continue, no null
        OPpost.filter = false
      } else {
        OPpost.filter = true
      }
    }

    if (dateFilter && display) {
      for (let i = 0; i < dateFilter.length; i++) {
        if (!OPpost.date.includes(dateFilter[i])) {
          display = false // future: we will continue, no null
          OPpost.filter = false
        } else {
          OPpost.filter = true
          // if the 2nd item of the array is found in the date, make display 'true'
          display = true
          break
        }
      }
    }

    if (nameFilter && display) {
      if (OPpost.name.toLowerCase() !== nameFilter.trim()) {
        display = false // future: we will continue, no null
        OPpost.filter = false
      } else {
        OPpost.filter = true
      }
    }

    // if we passed all of the "OP post" filters, display the thread
    if (display) {
      OPpost.display = true
    }
    // If we have not passed all of the "OP post" filters, we will continue on
    // Do our replies meet our criteria?

    // Filter through replies
    function PostReplies(OPpost, display) {
      var repDisplay = false
      if (OPpost.replies.length > 0) {
        const replyPost = OPpost.replies
        // If filter finds one reply that meets ALL criteria, return the whole thread
        for (let i = 0; i < replyPost.length; i++) {
          display = true
          //console.log(replyPost[i])

          if (videoCreatorComRep) {
            if (!replyPost[i].isCreatorRep) {
              display = false // future: we will continue and see if replies have any creator comments
              replyPost[i].filter = false
            } else {
              display = true
              replyPost[i].filter = true
            }
          }

          // If display is still true, enter wordfilter if it exists
          if (wordFilter && display) {
            if (!replyPost[i].reply.toLowerCase().includes(wordFilter)) {
              display = false
              replyPost[i].filter = false
            } else {
              display = true
              replyPost[i].filter = true
            }
          }

          if (likesFilter && display) {
            if (replyPost[i].likesRep < likesFilter) {
              display = false // future: we will continue, no null
              replyPost[i].filter = false
            } else {
              display = true
              replyPost[i].filter = true
            }
          }

          if (dateFilter && display) {
            for (let j = 0; j < dateFilter.length; j++) {
              if (!replyPost[i].dateRep.includes(dateFilter[j])) {
                display = false // future: we will continue, no null
                replyPost[i].filter = false
              } else {
                display = true
                replyPost[i].filter = true
                break
              }
            }
          }

          if (nameFilter && display) {
            if (replyPost[i].nameRep.toLowerCase() !== nameFilter.trim()) {
              display = false // future: we will continue, no null
              replyPost[i].filter = false
            } else {
              display = true
              replyPost[i].filter = true
            }
          }

          // If we have passed through all of the reply filters, return out of the function
          if (display === true) {
            repDisplay = true
          }

        }
        if (repDisplay === true) {
          return repDisplay
        }
      } else {

        // if no replies, just use the same "display" case
        return display
      }
    }

    // more filter checking
    const repDisplay = PostReplies(OPpost, display)

    if (OPpost.display || repDisplay) {
      return OPpost
    } else {
      return null
    }

  })

  return JSONresult
}
