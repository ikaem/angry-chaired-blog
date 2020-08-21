---
title: 'Gatsby Web: Implement Messaging Feature'
date: 2020-08-17 07:59:20
tags:
- gatsby
- messaging
categories: gatsby web
cover: kevin-mueller-nB_l59Q0vFE-unsplash.jpg

creditArtist: Kevin Mueller
creditSource: https://unsplash.com/@kevinmueller?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

<!-- Step Content Start -->

#### Part 9 of 10 in Gatsby Web

The **Contact** page contains a simple form that users could use to send us a message. There is also a list of other ways on how to contact us, but we want to offer a quick and simple way too, so users can do it on the spot.

<!--more-->

#### See [Project Information](#Project-Information)

## Step 9. Create send message feature on the contact page

Here is the **Contact** page, with focus on the form. There is not much to it. User has to provide name, email and message subject together with the actual message.

```js
// src/pages/contact.tsx

import React from "react"
// ...

const Contact: React.FC = () => {

  return (
    <Layout>
      <ContactStyled className="contact-page">
        <section
          className="contact-page__message-section" >
          {/* ... */}
          <form className="message-section__message-form">
            <label htmlFor="name" className="message-form__label">
              Name:
            </label>
            <input
              type="text"
              id="name"
              className="message-form__input"
              name="name"
              required
            />
            <label htmlFor="email" className="message-form__label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="message-form__input"
              name="email"
              required
            />
            <label htmlFor="subject" className="message-form__label">
              Subject:
            </label>
            <input
              type="text"
              id="subject"
              className="message-form__input"
              name="subject"
              required
            />
            <label htmlFor="message" className="message-form__label span-2">
              Message:
            </label>
            <textarea
              name="message"
              id="message"
              rows={10}
              className="message-form__input span-2"
              required
            />

            <button
              type="submit"
              className="message-form__btn-submit">
              <span className="btn-submit__label">Send</span>
            </button>
          </form>
        {/* ... */}
  )
```

Gatsby [documentation](https://www.gatsbyjs.org/docs/building-a-contact-form/) suggests several options to implement messaging functionality into a Gatsby website.
I decided to go with [getform.io](https://getform.io/), and the basic solution was a breeze.
I had to register on their website, click a big "Plus" button (that's how they refer to it), get the URL they generated, and assign it as a value of **action** attribute. Make sure that the **method** attribute on the **form** element is **"POST"**, and that inputs have **name** attributes, and you are good to go. That's it

I also found a [guide](https://blog.getform.io/building-a-gatsby-contact-form-using-getform/) to geform's own implementation of messaging on a Gatsby website, and this is what I base my solution on.

The getform's implementation builds on the basic solution by moving the URL endpoint to a submit handler, which is then called by the React's **onSubmit** event.
It also uses **Axios**, an HTTP client, to actually submit form data to the URL endpoint, and tests getform's response inside Axios' return promise to show a "thank you" message.

My version has stripped some of the logic, though.

This is what we will do: 

1. Create messaging functionality to submit message and react to the submission state on the **Contact** page
2. Use environment variables to "hide" our URL endpoint so it is not visible to the browser

### Create messaging functionality to submit message and react to the submission state on the **Contact** page

First things first. Let's create an accout on **getform.io**, click that big plus, and create a new form on their side. Then copy and save the URL endpoint.

Next, let's install **axios**:

```bash
npm i axios
```

We do not need to import anything into the **plugins** array of the **gatsby-config.js** file.
We do, however, import **axios** into **Contact** page:

```js
// src/pages/contact.tsx

import React from "react";
//...
import axios from "axios";
```

Before we actually submit anything, or show success or fail messages, let's log the data that our form contains once we click that **submit** button.

Create a function inside the **Contact** component and call it **handleSubmit**. Prevent the default submit behavior, and log the entire event target. Then, have the **onSubmit** event on the form call the **handleSubmit** function. The event target is now the form, and we should see the form element logged.

```js
// src/pages/contact.tsx

const Contact: React.FC = () => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("event target: ", e.target)
  }

  return (
    <Layout>
      <ContactStyled className="contact-page">
        <section className="contact-page__message-section">
          <PageTitle pageTitle={"Contact"} />
          <h2 className="message-section__paragraph-title">Message me</h2>

          <form
            className="message-section__message-form"
            onSubmit={handleSubmit}
          >
    {/* ... */}
```

Here is the log, cut for brevity:

```html
event target:

<form class=​"message-section__message-form" _lpchecked=​"1">​
  <label for=​"name" class=​"message-form__label">​Name:​</label>​
  <input type=​"text" id=​"name" class=​"message-form__input" name=​"name" required>​
  <label for=​"email" class=​"message-form__label">​Email:​</label>​
  <input type=​"email" id=​"email" class=​"message-form__input" name=​"email" required>​
  <label for=​"subject" class=​"message-form__label">​Subject:​</label>
  ​<input type=​"text" id=​"subject" class=​"message-form__input" name=​"subject" required>​
  <label for=​"message" class=​"message-form__label span-2">​Message:​</label>​
  <textarea name=​"message" id=​"message" rows=​"10" class=​"message-form__input span-2" required>​</textarea>
  ​<button type=​"submit" class=​"message-form__btn-submit">​…​</button>
​</form>​
```

Cool. But we don't have any values in this logged form.

Well, we should pass this form to the **FormData** constructor to create a FormData object. This object will have key-value pairs where keys are **name** properties of each element, and values are the element value properties.
This object is what the **getform API** needs.

We should also cast the event target as **HTMLFormElement**, as this is the type that the **FormData** constructor accepts.

Note that, if we log the **formData** object, it will seem empty. This is because the **formData** is [not a vanilla JS object](https://stackoverflow.com/questions/25040479/formdata-created-from-an-existing-form-seems-empty-when-i-log-it).
It is, however, an iterable, so to see its contents, we can iterate over its entries, or log its contents with the spread operator.

```js
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const formData = new FormData(form);

    console.log('"empty" form data:', formData);

    for(const inputKeyAndValue of formData.entries()) {
      console.log("actual input key and value:", inputKeyAndValue)
    }

    console.log("spread operator here:", ...formData);
```

Here is the log:

```json
"empty" form data: FormData {}

actual input key and value: (2) ["name", "John"]
actual input key and value: (2) ["email", "john@email.com"]
actual input key and value: (2) ["subject", "Test message"]
actual input key and value: (2) ["message", "This is test message"]

spread operator here: (2) ["name", "John"] (2) ["email", "john@email.com"] (2) ["subject", "Test message"] (2) ["message", "This is test message"]
```

Now that we know that we have actual data in our form, let's submit it to **getform.io**.

We will use **axios** for this.
To make a post request, which we need to do since we are sending data to the API, axios needs an argument object with 3 properties:

- **method**, which is "post"
- **url**, which is our url endpoint,
- and **data**, which is our **formData** object

The **axios** function returns a promise, so we will use the **then** method to log the response, and **catch** method to log a possible error.

```js
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const formData = new FormData(form);

    axios({
      method: "post",
      url: "https://getform.io/f/53a34abc-648d-4d47-81f3-10fbc475eac9",
      data: formData,
    })
    .then(response => {
      console.log("axios response:", response)
    })
    .catch(error => {
      console.log("axios error:", error)
    })
  }
```

Here is what we get with a successful submission:

```js
axios response:
  config: {url: "https://getform.io/f/53a34abc-648d-4d47-81f3-10fbc475eac9", method: "post", data: FormData, headers: {…}, transformRequest: Array(1), …}
  data: "<!doctype html>↵<html lang="en">↵<head>↵    <scrip"
  headers: {cache-control: "no-cache, private", content-length: "7094", content-type: "text/html; charset=UTF-8"}
  request: XMLHttpRequest {readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, onreadystatechange: ƒ, …}
  status: 200
  statusText: "OK"
```

The **config** object is holds information related to the request we made, such as the method type, url and data sent to the API. This is an **axios** data.
The **data** property holds information returned to us by the actual API. In case of **getform.io**, successful submission returns an HTML of a "thank you" page. We will not use it.
We are interested in the **status** property. If this property is 200, the submission was a success. Otherwise, there was a problem.

Let's adjust the logic, so that in case the submission was not a success, we will throw an error, causing the **catch** block to activate, and then log the error. 
In case there is no error, we want to reset the form to offer a possiblity of sending a new message.

```js
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // ...
    const form = e.target as HTMLFormElement
    // ...
    .then(response => {
      console.log("axios response:", response)
      if (response.status !== 200) throw new Error("Send message failed")
      form.reset();
    })
    .catch(error => {
      console.log("axios error:", error)
    })
  }
```

Alright. Now we submit data, and if response status is 200, it is all good. If the status is not 200, we throw an error.

Let's work on this a bit. 
Since we are not showing **getform.io**'s "thank you" page, we should provide some data of our own to let user know if the messaging was a success or fail.

For this, let's create a state to indicate the state of the message submission. 
We can use one state to indicate:

- current state of submitting, meaning is the message being submitted right now, at this moment. 
- status of the submission, meaning if the message submission succeeded or failed. We will type this as either **null**, or an object containing an **ok** property of **boolean** type, and a **msg** property of **string** type.

As no submission is being done or is done when the component first mounts, initial values of both state properties are falsy.

```js

const Contact: React.FC = () => {
  const [submissionState, setSubmissionState] = useState<{
    submitting: boolean
    status: { ok: boolean; msg: string } | null
  }>({
    submitting: false,
    status: null,
  })
  // ...
```


Now, let's create a paragraph in the component's return, to render that **msg** property. We will render this paragraph only if the state **status** property is a truthy value. 

```js
  return (
    {/* ... */}
      </form>
      {submissionState.status && (
        <p className="message-form__submission-message">
          {submissionState.status.msg}
        </p>
      )}
    </section>
```

Now, we just have to set **submissionState** based on the response from the **getform.io**.
We can do it in **.then** and **.catch** blocks:

```js
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // ...
    const form = e.target as HTMLFormElement
    // ...
    .then(response => {
      console.log("axios response:", response)
      if (response.status !== 200) throw new Error("Send message failed")
      form.reset();
      setSubmissionState({
        status: {
          ok: true,
          msg:
            "Thank you! Your message was sent successfully. I will respond as soon as possible.",
        },
        submitting: false,
      })
    })
    .catch(error => {
      console.log("axios error:", error)
      setSubmissionState({
        status: {
          ok: false,
          msg:
            "There was a problem submitting the message. Please try again or use one of the other contact options. Thank you.",
        },
        submitting: false,
      })
    })
  }
```
Cool. This now works. Try sending a message and see if it works. Success and fail messages should show up under the submit button.

Speaking of the fail message, you can create one by passing an incompatible data to the axios method. 
I also tried using an incorrect URL endpoint by adding more characters at the end of the URL. This did not work, though, and axious returned a 200 status. I assume it is because **getform.io** doesn't really check if a URL exists, but just sends the request to the URL.
Changing the domain name, however, did cause a **Network Error**, as **"url: "https://ggetform.io/"** probably doesn't exist.

You probably noticed that we keep the status' **submitting** property **false** all the time. 
What we can do with it is disable the submit button during the actual submission so that user cannot submit another message while there is a submission in process.

For this, we just need to change the **submitting** value to **true** just before **axios** sends the request, and set the submit button to be **disabled** if the **submitting** property is **true**.
Once **axios** receives a response from the API, whether it is true or false, the **submitting** property is back to **false**, and we can send a new message.

```js
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  // ...

  setSubmissionState(prevState => {
    return {
      ...prevState,
      submitting: true,
    }
  })

  axios({
    // ...
}

return (
  {/* ... */}

    <button
      type="submit"
      className="message-form__btn-submit"
      disabled={submissionState.submitting}>
      <span className="btn-submit__label">Send</span>
    </button>
```

### Use environment variables to "hide" our URL endpoint so it is not visible to the browser

Ideally, we would not keep the URL endpoint in our code. We would not anyone to use it by putting it into their code and have their users send messages to us. It's weird. 

For this, we would use environmet variables from which our could would pull necessary values.

It is very easy to create environment variables.
Gatsby gives us an option to make two files for this purpose. One is called **.env.development**, and it is used to hold environment variables for use during development. 
The other is called **.env.production**, and is used to hold environment variables for production builds.

Both of these live in the root of our project. Let's create them there, and put this same entry in both. This is the URL endpoint to our from on **getform.io**.

```
GATSBY_MESSAGING_ENDPOINT = "https://getform.io/f/53a34abc-648d-4d47-81f3-10fbc475eac9"
```

Environment variables in Gatsby have to start with **"GATSBY__"**. 

Now, let's make sure our .env files don't get commited to Github by adding them to **.gitignore** file.

```yaml
# dotenv environment variable files
.env
.env.development
.env.production
```

We can now adjust the axios url in the **Contact** page to use our newly created environment variable instead or the explicit URL string.

```js
// pages/contact.tsx
// ...
    axios({
      method: "post",
      url: process.env.GATSBY_MESSAGING_ENDPOINT,
      data: formData,
    })
// ...
```

Great. Restart the server and try sending a message. It should work as before.
Now stop the development server, and make a production build with **gatsby build**, and then serve it on port **9000** with **gatsby serve**.
Try opening the website and sending a message. All should be well again.

Very good. We have reached the end of this post, after successfully sending few messages to ourselves, and hiding our endpoint URL from ourselves, as well. 

In the next one we will reach the finish line. We will audit the website with **Chrome Developer Tools**, do some finishing touches like SEO optimization and offline support. Finally, we will deploy the website. 

<!-- End Step Content -->

<!-- Project Information -->

## Project Information

### Available at 

- [Github](https://github.com/ikaem/angry-chaired-gatsby) 
- [Live project](https://angrychaired.surge.sh/)

### Goals

1. A Gatsby website with a list of projects on home page
2. Dedicated pages for each project
3. Write project information in Markdown
4. Functional message form 
5. Deployed website

### Steps

1. Create new Gatsby project with TS and create basic pages
2. Create layout and its elements, and other components
3. Install Styled Components and its Gatsby plugin to style pages
4. Get data with Filesystem plugin and GraphQL
5. Write projects content in Markdown, transform and query them with the transformer-remark plugin
6. Programatically create pages from Markdown files
7. Insert Markdown files into pages with the transformer-remark plugin
8. Use Gatsby Image to work with images
9. **Create send message feature on the contact page**
10. Audit, optimize and deploy the website

### Tech and Tools

1. React
2. Gatsby
3. Markdown
4. TypeScript
5. Getform.io
6. Surge
7. Styled Components

### Experience with Tech & Tools

Prior to this project, I had very little experience with Gatsby. I did a little something with Next.js, another React framework that focuses on server-side rendered websites. I am ok with GraphQL, on which Gatsby heavily relies to get its data, and I am ok with TS too.  

## DISCLAIMER

Don't take any of this seriously and as a matter-of-fact. These are my notes. It might look like I am trying to teach something to someone. I am not.


