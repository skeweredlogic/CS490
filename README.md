CS490
=====

Semester project for CS490
--------------------------

**Description:**

You will form groups of three to create a new and improved online testing system similar to, but better than, codingbat.com. For reference, refer to the existing one located at:

http://www.codingbat.com

The milestones for the project are:

**October 6th:** Alpha 5% (Skeleton MVC - Login authentication system.)
Login via both NJIT authentication (choose your own method) and via a backend user database


**October 27th:** Beta 15% (Should have at least the basic/core functionality. In addition to assigning roles based on login, you must implement four use cases as a minimum: 1. an instructor can create a new question and add it to the question bank, 2. an instructor can select questions from the question bank to make up an exam, 3. a student can take the exam, and 4. a student can check score and feedback for automatically graded exam.)	


**November 24th:** Release Candidate 20% (All major functionality should be in place. Only minor bugs and cosmetic fixes should remain to be addressed.)


**December 1st:** Exam 

**December 8th:** Final Version 30% (This version should be completely functional, intuitive and easy to use, beautiful and impressive.)

On each of the above dates, by no later than 4:00 pm, you must 1) turn in a hard copy of all code you have written and 
2) be prepared to demonstrate the functionality of the working project.

**Constraints:**

You must follow a Model View Controller architecture. Each student will be responsible for only one part, with no overlap. You will be graded individually on your contribution to the group project. To ensure that, you may ONLY run code from your own AFS account. 

We will develop a communication protocol that all groups will be required to employ. Post requests will be used for requests; XML or JSON will be used for replies.

You will lose points if you fail to comply with any of the requirements or constraints specified above




**Additional caveats discussed during lecture:**
 - No routing libraries such as Toro.php
 - No frameworks or major tools (jQuery, AngularJS, Node.js, etc.)
 - Basically, plain old vanilla PHP, CSS, HTML, and ECMAScript
 - All POST requests should hit one central application, from which the middleware and backend will route the requests
