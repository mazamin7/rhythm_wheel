<div id="top"></div>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/mazamin7/rhythm_wheel">
    <img src="src/resources/images/project_title.png" alt="Project title">
  </a>
  <a href="https://github.com/mazamin7/rhythm_wheel">
    <img src="src/resources/images/logo.png" alt="Logo" width="160" height="160">
  </a>
</div>

<h3 align="center">Rhythm Wheel</h3>
  <p align="center">
    An easier way to visualize and represent rhythms
    <br />
    <a href="https://github.com/mazamin7/rhythm_wheel"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/mazamin7/rhythm_wheel">View Demo</a>
    ·
    <a href="https://github.com/mazamin7/rhythm_wheel/issues">Report Bug</a>
    ·
    <a href="https://github.com/mazamin7/rhythm_wheel/issues">Request Feature</a>
  </p>
</h3>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
	<li><a href="#running">Running</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

<iframe width="1280" height="720" src="https://www.youtube.com/embed/3YUWU_Ernf4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

In this project we have developed a rhythm wheel, that is a drum machine that has a simpler way to represent the rhythm. In fact in standard notation, rhythm is indicated on a musical bar line. This thing most of the time can be hard to visualize and represent; in order to solve this problem we thought of a better way to do the same thing. <br />

We had a simple idea: just as a clock can trace the linear passage of time, the flow of rhythm can be traced in a circle; in this way the rhythm is easier to visualize and it’s easier to represent its repetition through time. <br />

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

* [Vue.js](https://vuejs.org/)
* [Tone.js](https://tonejs.github.io/)
* [BootstrapVue](https://bootstrap-vue.org/)
* [Firestore](https://firebase.google.com/docs/firestore)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/mazamin7/rhythm_wheel.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
   
### Running

1. Go to the repository directory
   ```sh
   cd rhythm_wheel
   ```
2. Start the server
   ```sh
   npm start
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

REPRESENTING THE RHYTHM<br/>
In order to fill a step, you have to click once on the desired location.<br/>
Click once again to mark the step as accented.
Click one more time and it’s removed.<br/>
<img src="src/resources/images/case_of_use_1.png" alt="First case of use">

SAVING/LOADING THE RHYTHM<br/>
The user can store and load his rhythmic patterns on the cloud.<br/>
<img src="src/resources/images/case_of_use_2.png" alt="Second case of use">

GENERATING A RANDOM RHYTHM<br/>
The user can ask the application to generate a random rhythm on-the-fly.
Randomization settings are customizable.<br/>
<img src="src/resources/images/case_of_use_3.png" alt="Third case of use">

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- FEATURES -->
## Features
	
- [✓] Different number of beats/steps for each ring<br/>
- [✓] Support for accents (a step can be stressed or unstressed)<br/>
- [✓] Support for polyrhythms<br/>
- [✓] Ring color is customizable<br/>
- [✓] Instrument selectable by the user<br/>
	- [✓] Big collection of instrument samples<br/>
- [✓] Phase delay controller by the user (steer the ring).<br/>
- [✓] The RPM can be controlled by the user<br/>
- [✓] The volume can be controlled by the user<br/>
- [✓] Rhythmic patterns can be loaded and saved on the cloud<br/>
- [✓] Generation a random pattern<br/>
	- [✓] Generation of random numbers starting from environmental noise<br/>

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Alberto Bollino - alberto.bollino@mail.polimi.it<br/>
Gerardo Cicalese - gerardo.cicalese@mail.polimi.it<br/>
Gennaro D'Imperio - gennaro.dimperio@mail.polimi.it<br/>
Giorgio Granello - giorgio.granello@mail.polimi.it<br/>

Project Link: [https://github.com/mazamin7/rhythm_wheel](https://github.com/mazamin7/rhythm_wheel)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/mazamin7/rhythm_wheel.svg?style=for-the-badge
[contributors-url]: https://github.com/mazamin7/rhythm_wheel/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/mazamin7/rhythm_wheel.svg?style=for-the-badge
[forks-url]: https://github.com/mazamin7/rhythm_wheel/network/members
[stars-shield]: https://img.shields.io/github/stars/mazamin7/rhythm_wheel.svg?style=for-the-badge
[stars-url]: https://github.com/mazamin7/rhythm_wheel/stargazers
[issues-shield]: https://img.shields.io/github/issues/mazamin7/rhythm_wheel.svg?style=for-the-badge
[issues-url]: https://github.com/mazamin7/rhythm_wheel/issues
[license-shield]: https://img.shields.io/github/license/mazamin7/rhythm_wheel.svg?style=for-the-badge
[license-url]: https://github.com/mazamin7/rhythm_wheel/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png
