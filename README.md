# node-pingdom

Provides access to the Pingdom JSON API.

## Installation

    npm install pingdom

## Tests

Tests use [vows](http://vowsjs.org) and can be run as `vows test/test_pingdom_api.js`.  Note that to run the test suite, you must create a credentials.json file within the root directory of this repository.  The file should be formatted like this:

    {
        "username" : "myusername@mydomain.com",
        "password" : "not_a_great_password",
        "app_key" : "111122223333444555aaabbbcccdddeeefff"
    }

## Usage

Each method call of the Pingdom API expects your username and password.  All optional parameters are passed in as a hash of name/value pairs which are composed into a query string.  By default, the Pingdom API is assumed to be version 2.0, but this can be modified via the setAPIVersion method.

## Author

Ryan Breen (ryan at ryanbreen.com)

## License

Copyright (C) 2011 by Ryan Breen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
