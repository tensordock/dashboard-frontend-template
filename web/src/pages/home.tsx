import { ReactTyped } from 'react-typed';
import { useEffect, useRef, useState } from 'react';

import Head from '../components/head';

import BGImage from '../assets/img/bg.jpg';
import DeployImage from '../assets/img/deploy.png';
import DeploymentsImage from '../assets/img/deployments.png';
import CodeAPIImage from '../assets/img/code_api.png';
import MoneyImage from '../assets/img/money.png';

// import './home.css';
// import '../custom.css';

export default function HomePage() {
  const navbarRef = useRef<HTMLDivElement>(null!);
  const sectionRef = useRef<HTMLDivElement>(null!);

  const [scrolledBelowSplash, setScrolledBelowSplash] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (
        navbarRef.current.clientHeight >
        sectionRef.current.getBoundingClientRect().top
      ) {
        // we are below
        if (!scrolledBelowSplash) setScrolledBelowSplash(true);
      } else {
        // we are above
        if (scrolledBelowSplash) setScrolledBelowSplash(false);
      }
    };
    document.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('scroll', onScroll);
    };
  });

  return (
    <>
      <Head title={`H100cloud.com — H100 SXM5's from $2.50/hr`} />
      <main className="main" id="top">
        <nav
          className={`navbar navbar-standard navbar-expand-lg fixed-top navbar-dark transition-all ${scrolledBelowSplash ? 'bg-[#1F4BA7]/90 shadow-lg backdrop-blur' : ''}`}
          data-navbar-darken-on-scroll="data-navbar-darken-on-scroll"
          ref={navbarRef}
        >
          <div className="container">
            <a className="navbar-brand" href="/">
              <span className="text-white dark__text-white">H100cloud</span>
            </a>
            <button
              className="navbar-toggler collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarStandard"
              aria-controls="navbarStandard"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse scrollbar"
              id="navbarStandard"
            >
              <ul
                className="navbar-nav"
                data-top-nav-dropdowns="data-top-nav-dropdowns"
              >
                <li className="nav-item dropdown">
                  <a className="nav-link" href="/deploy">
                    Deploy
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link"
                    href="https://strategicinfra.com"
                    target="_blank"
                  >
                    Infrastructure
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link"
                    href="https://tensordock.gitbook.io/whitelabeled-storefronts-tensordock/"
                    role="button"
                    target="_blank"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto">
                <li className="nav-item d-flex align-items-center me-2">
                  <div className="dropdown theme-control-dropdown landing-drop">
                    <a
                      className="nav-link d-flex align-items-center dropdown-toggle fa-icon-wait pe-1"
                      href="#"
                      role="button"
                      id="themeSwitchDropdown"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <span className="d-none d-lg-block">
                        <span
                          className="fas fa-sun"
                          data-theme-dropdown-toggle-icon="light"
                        ></span>
                        <span
                          className="fas fa-moon"
                          data-theme-dropdown-toggle-icon="dark"
                        ></span>
                        <span
                          className="fas fa-adjust"
                          data-theme-dropdown-toggle-icon="auto"
                        ></span>
                      </span>
                      <span className="d-lg-none">Switch theme</span>
                    </a>
                    <div
                      className="dropdown-menu dropdown-menu-end dropdown-caret border py-0 mt-1"
                      aria-labelledby="themeSwitchDropdown"
                    >
                      <div className="bg-white dark__bg-1000 rounded-2 py-2">
                        <button
                          className="dropdown-item link-600 d-flex align-items-center gap-2"
                          type="button"
                          value="light"
                          data-theme-control="theme"
                        >
                          <span className="fas fa-sun"></span>Light
                          <span className="fas fa-check dropdown-check-icon ms-auto text-600"></span>
                        </button>
                        <button
                          className="dropdown-item link-600 d-flex align-items-center gap-2"
                          type="button"
                          value="dark"
                          data-theme-control="theme"
                        >
                          <span
                            className="fas fa-moon"
                            data-fa-transform
                          ></span>
                          Dark
                          <span className="fas fa-check dropdown-check-icon ms-auto text-600"></span>
                        </button>
                        <button
                          className="dropdown-item link-600 d-flex align-items-center gap-2"
                          type="button"
                          value="auto"
                          data-theme-control="theme"
                        >
                          <span
                            className="fas fa-adjust"
                            data-fa-transform
                          ></span>
                          Auto
                          <span className="fas fa-check dropdown-check-icon ms-auto text-600"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/signup">
                    Register
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* <!-- ============================================--> */}
        {/* <!-- <section> begin ============================--> */}
        <section
          className="py-0 overflow-hidden"
          id="banner"
          data-bs-theme="light"
        >
          <div
            className="bg-holder overlay"
            style={{
              backgroundImage: `url(${BGImage})`,
              backgroundPosition: 'center bottom',
            }}
          ></div>
          {/* <!--/.bg-holder--> */}

          <div className="container">
            <div className="row flex-center pt-8 pt-lg-10 pb-lg-9 pb-xl-0">
              <div className="col-md-11 col-lg-8 col-xl-5 pb-7 pb-xl-9 text-center text-xl-start">
                <h1 className="text-white fw-light">
                  The H100 cloud — <b className="inline-block">$2.50/hr</b>.{' '}
                  <br />
                  On demand{` `}
                  <ReactTyped
                    className="typed-text fw-bold"
                    strings={['AI', 'HPC', 'image gen', 'ML', 'acceleration']}
                    typeSpeed={50}
                    loop={true}
                    backDelay={1500}
                  ></ReactTyped>
                  .
                </h1>
                <p className="lead text-white opacity-75">
                  H100cloud gives you access to the industry's most powerful
                  GPUs for your most demanding HPC workloads
                </p>
                <a
                  className="btn btn-light border-2 rounded btn-lg mt-4 fs-9 py-2"
                  href="/deploy"
                >
                  Deploy a GPU server
                </a>
                {` `}
                <a
                  className="btn btn-outline-light border-2 rounded btn-lg mt-4 fs-9 py-2"
                  href="https://www.strategicinfra.com/"
                >
                  Custom Servers
                </a>
              </div>
              <div className="col-xl-7 mt-xl-0">
                <a className="rounded" href="/deploy">
                  <img
                    className="img-landing-banner img-fluid"
                    src={DeployImage}
                  />
                </a>
              </div>
            </div>
          </div>
          {/* <!-- end of .container--> */}
        </section>
        <section ref={sectionRef}>
          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-9 col-xl-8 col-xxl-7">
                <h1 className="fs-7 fs-sm-5 fs-md-4">
                  Highly performant hardware, <b>secure.</b>
                </h1>
                <video
                  muted
                  autoPlay
                  loop
                  className="w-100 my-4"
                  src="https://www.strategicinfra.com/assets/h100cloud.webm"
                  // @ts-expect-error - video type
                  type="video/mp4"
                  width="1200"
                ></video>
                <p className="lead">
                  Through H100cloud, you get to access cloud resources that
                  previously only long-term contract customers could access —{' '}
                  <b>available on-demand, pro-rated to the microsecond</b>.
                </p>
              </div>
            </div>
            <div className="row flex-center mt-8">
              <div className="col-md col-lg-5 col-xl-4 ps-lg-6">
                <img
                  className="img-fluid px-6 px-md-0"
                  style={{ filter: 'grayscale(100%)' }}
                  src={DeploymentsImage}
                />
              </div>
              <div className="col-md col-lg-5 col-xl-4 mt-4 mt-md-0">
                <h5 className="text-primary">
                  <svg
                    className="svg-inline--fa fa-paper-plane fa-w-16 me-2"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="paper-plane"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    data-fa-i2svg
                  >
                    <path
                      fill="currentColor"
                      d="M440 6.5L24 246.4c-34.4 19.9-31.1 70.8 5.7 85.9L144 379.6V464c0 46.4 59.2 65.5 86.6 28.6l43.8-59.1 111.9 46.2c5.9 2.4 12.1 3.6 18.3 3.6 8.2 0 16.3-2.1 23.6-6.2 12.8-7.2 21.6-20 23.9-34.5l59.4-387.2c6.1-40.1-36.9-68.8-71.5-48.9zM192 464v-64.6l36.6 15.1L192 464zm212.6-28.7l-153.8-63.5L391 169.5c10.7-15.5-9.5-33.5-23.7-21.2L155.8 332.6 48 288 464 48l-59.4 387.3z"
                    ></path>
                  </svg>
                  DEPLOY
                </h5>
                <h3>
                  Unbeatable <b>Performance</b>
                </h3>
                <p>
                  Our H100 SXM5 GPUs outperform H100 PCIE cards by 30%, measured
                  by raw FP32 performance
                </p>
              </div>
            </div>
            <div className="row flex-center mt-7">
              <div
                className="col-md col-lg-5 col-xl-4 pe-lg-6 order-md-2"
                style={{ filter: 'grayscale(100%)' }}
              >
                <img className="img-fluid px-6 px-md-0" src={CodeAPIImage} />
              </div>
              <div className="col-md col-lg-5 col-xl-4 mt-4 mt-md-0">
                <h5 className="text-primary">
                  <svg
                    className="svg-inline--fa fa-object-ungroup fa-w-18 me-2"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="object-ungroup"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    data-fa-i2svg
                  >
                    <path
                      fill="currentColor"
                      d="M564 224c6.627 0 12-5.373 12-12v-72c0-6.627-5.373-12-12-12h-72c-6.627 0-12 5.373-12 12v12h-88v-24h12c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12h-72c-6.627 0-12 5.373-12 12v12H96V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v72c0 6.627 5.373 12 12 12h12v160H12c-6.627 0-12 5.373-12 12v72c0 6.627 5.373 12 12 12h72c6.627 0 12-5.373 12-12v-12h88v24h-12c-6.627 0-12 5.373-12 12v72c0 6.627 5.373 12 12 12h72c6.627 0 12-5.373 12-12v-12h224v12c0 6.627 5.373 12 12 12h72c6.627 0 12-5.373 12-12v-72c0-6.627-5.373-12-12-12h-12V224h12zM352 64h32v32h-32V64zm0 256h32v32h-32v-32zM64 352H32v-32h32v32zm0-256H32V64h32v32zm32 216v-12c0-6.627-5.373-12-12-12H72V128h12c6.627 0 12-5.373 12-12v-12h224v12c0 6.627 5.373 12 12 12h12v160h-12c-6.627 0-12 5.373-12 12v12H96zm128 136h-32v-32h32v32zm280-64h-12c-6.627 0-12 5.373-12 12v12H256v-12c0-6.627-5.373-12-12-12h-12v-24h88v12c0 6.627 5.373 12 12 12h72c6.627 0 12-5.373 12-12v-72c0-6.627-5.373-12-12-12h-12v-88h88v12c0 6.627 5.373 12 12 12h12v160zm40 64h-32v-32h32v32zm0-256h-32v-32h32v32z"
                    ></path>
                  </svg>
                  BUILD
                </h5>
                <h3>
                  REST <b>API</b>
                </h3>
                <p>
                  Deploy and manage VMs programatically with our well-documented
                  API. Scale up/down instantly.
                </p>
              </div>
            </div>
            <div className="row flex-center mt-7">
              <div
                className="col-md col-lg-5 col-xl-4 ps-lg-6"
                style={{ filter: 'grayscale(100%)' }}
              >
                <img className="img-fluid px-6 px-md-0" src={MoneyImage} />
              </div>
              <div className="col-md col-lg-5 col-xl-4 mt-4 mt-md-0">
                <h5 className="text-primary">
                  <svg
                    className="svg-inline--fa fa-lightbulb fa-w-11 me-2"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="lightbulb"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 352 512"
                    data-fa-i2svg
                  >
                    <path
                      fill="currentColor"
                      d="M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16 16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16 16-16s-7.16-16-16-16zM96.06 459.17c0 3.15.93 6.22 2.68 8.84l24.51 36.84c2.97 4.46 7.97 7.14 13.32 7.14h78.85c5.36 0 10.36-2.68 13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7 2.68-8.84l.05-43.18H96.02l.04 43.18zM176 0C73.72 0 0 82.97 0 176c0 44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42 92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64 59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24 60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507 0 0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55 260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z"
                    ></path>
                  </svg>
                  SAVE
                </h5>
                <h3>
                  H100s, <b>$2.50/hr</b>
                </h3>
                <p>
                  ... a price-to-performance ratio only available on long-term
                  contracts from other suppliers.
                </p>
              </div>
            </div>
          </div>
          {/* <!-- end of .container--> */}
        </section>
        <section className="bg-body-tertiary dark__bg-opacity-50 text-center">
          <div className="container">
            <div className="row">
              <div className="col">
                <h1 className="fs-7 fs-sm-5 fs-md-4">
                  All the bells and whitles
                </h1>
                <p className="lead">
                  Available right out of the box with H100cloud.
                </p>
              </div>
            </div>
            <div className="row mt-6">
              <div className="col-lg-4">
                <div className="card card-span h-100">
                  <div className="card-span-img">
                    <svg
                      className="svg-inline--fa fa-ubuntu fa-w-16 text-900 fs-6"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="ubuntu"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 496 512"
                      data-fa-i2svg
                    >
                      <path
                        fill="currentColor"
                        d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm52.7 93c8.8-15.2 28.3-20.5 43.5-11.7 15.3 8.8 20.5 28.3 11.7 43.6-8.8 15.2-28.3 20.5-43.5 11.7-15.3-8.9-20.5-28.4-11.7-43.6zM87.4 287.9c-17.6 0-31.9-14.3-31.9-31.9 0-17.6 14.3-31.9 31.9-31.9 17.6 0 31.9 14.3 31.9 31.9 0 17.6-14.3 31.9-31.9 31.9zm28.1 3.1c22.3-17.9 22.4-51.9 0-69.9 8.6-32.8 29.1-60.7 56.5-79.1l23.7 39.6c-51.5 36.3-51.5 112.5 0 148.8L172 370c-27.4-18.3-47.8-46.3-56.5-79zm228.7 131.7c-15.3 8.8-34.7 3.6-43.5-11.7-8.8-15.3-3.6-34.8 11.7-43.6 15.2-8.8 34.7-3.6 43.5 11.7 8.8 15.3 3.6 34.8-11.7 43.6zm.3-69.5c-26.7-10.3-56.1 6.6-60.5 35-5.2 1.4-48.9 14.3-96.7-9.4l22.5-40.3c57 26.5 123.4-11.7 128.9-74.4l46.1.7c-2.3 34.5-17.3 65.5-40.3 88.4zm-5.9-105.3c-5.4-62-71.3-101.2-128.9-74.4l-22.5-40.3c47.9-23.7 91.5-10.8 96.7-9.4 4.4 28.3 33.8 45.3 60.5 35 23.1 22.9 38 53.9 40.2 88.5l-46 .6z"
                      ></path>
                    </svg>
                  </div>
                  <div className="card-body pt-6 pb-4">
                    <h5 className="mb-2">Configurable OS</h5>
                    <p>
                      Select from a range of operating systems depending on your
                      needs, from Ubuntu to Windows. Provide custom images to
                      us, and scale your AI inference application.{' '}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mt-6 mt-lg-0">
                <div className="card card-span h-100">
                  <div className="card-span-img">
                    <svg
                      className="svg-inline--fa fa-lock fa-w-14 text-900 fs-6"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="lock"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      data-fa-i2svg
                    >
                      <path
                        fill="currentColor"
                        d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"
                      ></path>
                    </svg>
                  </div>
                  <div className="card-body pt-6 pb-4">
                    <h5 className="mb-2">Security</h5>
                    <p>
                      We operate out of secure tier 2 and 3 data centers
                      equipped with 24/7 onsite CCTV and armed security guards,
                      ensuring the physical security of your data
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mt-6 mt-lg-0">
                <div className="card card-span h-100">
                  <div className="card-span-img">
                    <svg
                      className="svg-inline--fa fa-server fa-w-16 text-900 fs-6"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="server"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      data-fa-i2svg
                    >
                      <path
                        fill="currentColor"
                        d="M480 160H32c-17.673 0-32-14.327-32-32V64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm112 248H32c-17.673 0-32-14.327-32-32v-64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm112 248H32c-17.673 0-32-14.327-32-32v-64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24z"
                      ></path>
                    </svg>
                  </div>
                  <div className="card-body pt-6 pb-4">
                    <h5 className="mb-2">Reliable</h5>
                    <p>
                      We've operated physical hardware for 6 years across a
                      dozen data center facilities. Our well-experienced team is
                      available to resolve any problem, hardware or otherwise.{' '}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- end of .container--> */}
        </section>
        <section className="bg-dark" data-bs-theme="light">
          <div
            className="bg-holder overlay"
            style={{
              backgroundImage: `url(${BGImage})`,
              backgroundPosition: 'center bottom',
            }}
          ></div>
          {/* <!--/.bg-holder--> */}

          <div className="container">
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <p className="fs-6 fs-sm-5 text-white">
                  Deploy a cloud H100 today from just <br />
                  <b>$2.50/hour</b>
                </p>
                <a
                  href="/signup"
                  className="btn btn-light border-2 rounded btn-lg mt-4 fs-9 py-2"
                >
                  Get started
                </a>
                {` `}
                <a
                  href="https://www.strategicinfra.com/"
                  className="btn btn-outline-light border-2 rounded btn-lg mt-4 fs-9 py-2"
                  target="_blank"
                >
                  Custom Requests
                </a>
              </div>
            </div>
          </div>
          {/* <!-- end of .container--> */}
        </section>
        {/* <!-- <section> close ============================-->
      <!-- ============================================-->

      <!-- ============================================-->
      <!-- <section> begin ============================--> */}
        <section className="bg-dark pt-8 pb-4" data-bs-theme="light">
          <div className="container">
            <div className="position-absolute btn-back-to-top bg-dark">
              <a className="text-600" href="#banner" data-bs-offset-top="0">
                <span
                  className="fas fa-chevron-up"
                  data-fa-transform="rotate-45"
                ></span>
              </a>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <h5 className="text-white opacity-85 mb-3">H100cloud</h5>
                <p className="text-600">
                  H100cloud provides startups, AI labs, and enterprises access
                  to a massive NVIDIA GPU cloud colocated in the heart of the
                  United States managed by{' '}
                  <a href="https://www.strategicinfra.com/" target="_blank">
                    Strategic Infrastructure Holdings
                  </a>
                  , completely on-demand.
                </p>
              </div>
              <div className="col ps-lg-6 ps-xl-8">
                <div className="d-flex justify-content-end row mt-5 mt-lg-0">
                  <div className="col-3 col-md-3">
                    <h5 className="text-uppercase text-white opacity-85 mb-3">
                      Company
                    </h5>
                    <ul className="list-unstyled">
                      <li className="mb-1">
                        <a
                          className="link-600"
                          href="https://www.strategicinfra.com/"
                          target="_blank"
                        >
                          About
                        </a>
                      </li>
                      <li className="mb-1">
                        <a
                          className="link-600"
                          href="mailto:hello@h100cloud.com"
                        >
                          Contact
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-6 col-md-3">
                    <h5 className="text-uppercase text-white opacity-85 mb-3">
                      Product
                    </h5>
                    <ul className="list-unstyled">
                      <li className="mb-1">
                        <a className="link-600" href="/deploy">
                          Deploy
                        </a>
                      </li>
                      <li className="mb-1">
                        <a
                          className="link-600"
                          href="https://tensordock.gitbook.io/whitelabeled-storefronts-tensordock/"
                        >
                          Documentation
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- end of .container--> */}
        </section>
        {/* <!-- <section> close ============================-->
      <!-- ============================================-->

      <!-- ============================================-->
      <!-- <section> begin ============================--> */}
        <section className="py-0 bg-dark" data-bs-theme="light">
          <div>
            <hr className="my-0 text-600 opacity-25" />
            <div className="container py-3">
              <div className="row justify-content-between fs-10">
                <div className="col-12 col-sm-auto text-center">
                  <p className="mb-0 text-600 opacity-85">
                    <span className="d-none d-sm-inline-block"></span>
                    <br className="d-sm-none" /> Copyright &copy; 2024{' '}
                    <a
                      className="text-white opacity-85"
                      href="https://www.h100cloud.com"
                    >
                      H100cloud
                    </a>
                  </p>
                </div>
                <div className="col-12 col-sm-auto text-center">
                  <p className="mb-0 text-600 opacity-85">
                    All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- end of .container--> */}
        </section>
        {/* <!-- <section> close ============================-->
      <!-- ============================================--> */}
      </main>
    </>
  );
}
