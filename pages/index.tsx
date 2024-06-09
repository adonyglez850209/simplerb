import React, { useState } from 'react';
import Head from "next/head";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Image from "next/image";
import { Button, Tooltip } from "@mui/material";
import styles from "../components/CardsPricing.module.css";
import { useContext } from "react";
import SBRContext from "../context/SBRContext";
import { useClerk, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Snackbar from '@mui/joy/Snackbar';
import type { NextPage } from "next";
import mixpanel from "../utils/mixpanel-config";

const Home: NextPage = () => {

  const { openSignIn } = useClerk();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openDanger, setOpenDanger] = useState(false);
  const [message, setMessage] = useState('');

  const { isLoaded, user } = useUser();

  const context = useContext(SBRContext);
  if (!context) {
    throw new Error('SBRContext must be used within a SBRProvider');
  }
  const { subsTplan, setSubsTplan, setSubsCancel } = context;

  const handleSubscriptionFreeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoaded || !user) {
      openSignIn();
    } else {
      try {      
        const email = user.emailAddresses[0].emailAddress;
        const substplan = 'FREE';
        const subscancel = false;
  
        const data = {
          substplan,
          subscancel
        };
  
        const resp = await fetch(`/api/user-subscription?email=${email}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
    
        if (!resp.ok) {
          setMessage("Network response was not ok. Failed to set users subscription");
          setOpenDanger(true);
        } else {
          setMessage("FREE subscription success");
          setOpenSuccess(true);
          setSubsTplan('FREE');
          setSubsCancel(false);
          mixpanel.track("Subscription", {
            plan_subscription: 'FREE',
          });
        }
      } catch (error) {
        console.error("Subscription with error: ", error);
        mixpanel.track("Subscription with error", {
          plan_subscription: 'FREE',
          error: error
        });
      }
    }
  }

  // Handler function to track the event when the button is clicked
  const handleSubsStarterCreatorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the form from submitting traditionally
    event.preventDefault();
  
    // The Google Ads event snippet
    window.gtag && window.gtag('event', 'conversion', {
      'send_to': '16510475658/ZCyECJS9tqYZEIq758A9', // Your conversion ID and conversion label
    });

    // Safely access the form and submit it
    const form = event.currentTarget.form;

    if (form) {
      const formData = new FormData(form); // Crea un objeto FormData con los datos del formulario
      const tipo = formData.get('tipo');
      mixpanel.track("Subscription", {
        plan_subscription: tipo?.toString(),
      });
      form.submit();
    } else {
      // Handle the case where for some reason the form isn't available
      console.error("Form not found");
    }
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Domain Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate your business with AI
        </h1>

        <h2 className="mt-3">
          Effortlessly launch your new business with AI-powered tools that generate your domain name, build your website, and create Google Ads.
        </h2>

        {/* <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Let's Start Generating Your Business Domain{" "}
              <Tooltip
                title={
                  <div>
                    <p>
                      Type the main focus of your business or hobby. This helps
                      us suggest a domain that's just right for you
                    </p>
                  </div>
                }
              >
                <span className="info-icon cursor-pointer">&#x24D8;</span>
              </Tooltip>
            </p>
          </div>
          <textarea
            value=""
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "Enter Your Business or Hobby. E.g., Boutique Coffee Shop, Personal Fitness"
            }
          />
        </div> */}

        <SignedOut>
          <div className="my-4">
            <a
              onClick={() => openSignIn()}
              className="bg-black cursor-pointer rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
            >
              Start Business
            </a>
          </div>
        </SignedOut>

        {/* <div className={styles.pricingTitle}>
          <h2 className="font-medium mb-10">
            Or You Can Generate Your Website and/or Google Ads
          </h2>
        </div> */}

        <div className={styles.pricingTitle}>
          <h2 className="mt-12 font-medium" style={{ fontSize: 30 }}>
            A perfect fit for creators and businesses owners
          </h2>
        </div>

        <div className={styles.wrapperCard}>
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <h3>Free</h3>
              <h4>
                For individuals who want to try out the most advanced AI domain
                generator.
              </h4>
            </div>
            <div className={styles.cardPrice}>
              <h2>
                <sup>$</sup>0<small>forever</small>
              </h2>
            </div>
            <div className={styles.cardDescription}>
              <ul>
                <li className={styles.ok}>Unlimited domains names</li>
                <li className={styles.ok}>
                  Click to check domain availability
                </li>
                <li className={styles.ok}>See domain rating</li>
              </ul>
            </div>
            {subsTplan !== "FREE" ? (
              <>
                <div className={styles.cardAction}>
                  <button type="button" onClick={handleSubscriptionFreeClick}>
                    Get Free
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.cardTitle}>
                  <h3>subscribed</h3>
                </div>
              </>
            )}
          </div>

          <div className={`${styles.card} ${styles.popular}`}>
            <div className={styles.cardRibbon}>
              <span>most popular</span>
            </div>
            <div className={styles.cardTitle}>
              <h3>Starter</h3>
              <span className={styles.off}>First month 80% off</span>
              <h4>
                For hobbyists bringing ideas to life with AI by their side.
              </h4>
            </div>
            <div className={styles.cardPrice}>
              <h2>
                <sup>$</sup>
                <span className={styles.discountPrice}>5</span>
                <span className={styles.ml2}>
                  <sup>$</sup>1<small>/month</small>
                </span>
              </h2>
            </div>
            <div className={styles.cardDescription}>
              <ul>
                <li>Everything in free, plus</li>
                <li className={styles.ok}>
                  Generate only available domain names
                </li>
                <li className={styles.ok}>Website generator</li>
                <li className={styles.ok}>Support (Chat and Email)</li>
                <li className={styles.ok}>Premium features*</li>
              </ul>
            </div>
            {subsTplan !== "STARTER" ? (
              <>
                {!isLoaded || !user ? (
                  <div className={styles.cardAction}>
                    <button type="button" onClick={() => openSignIn()}>
                      Get Starter
                    </button>
                  </div>
                ) : (
                  <div className={styles.cardAction}>
                    <form action="/api/checkout_sessions" method="POST">
                      <input type="hidden" name="tipo" value={subsTplan} />
                      <button
                        type="submit"
                        onClick={handleSubsStarterCreatorClick}
                      >
                        Get Starter
                      </button>
                    </form>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className={styles.cardTitle}>
                  <h3>subscribed</h3>
                </div>
              </>
            )}
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <h3>Creator</h3>
              <span className={styles.off}>First month 50% off</span>
              <h4>
                For passionate creators building the apps they want to see in
                the world.
              </h4>
            </div>
            <div className={styles.cardPrice}>
              <h2>
                <sup>$</sup>
                <span className={styles.discountPrice}>22</span>
                <span className={styles.ml2}>
                  <sup>$</sup>
                  11
                  <small>/month</small>
                </span>
              </h2>
            </div>
            <div className={styles.cardDescription}>
              <ul>
                <li>Everything in starter, plus</li>
                <li className={styles.ok}>
                  Generate domains and websites with the latest AI model
                </li>
                <li className={styles.ok}>Priority support (Chat and Email)</li>
                <li className={styles.ok}>Premium features*</li>
              </ul>
            </div>
            {subsTplan !== "CREATOR" ? (
              <>
                {!isLoaded || !user ? (
                  <div className={styles.cardAction}>
                    <button type="button" onClick={() => openSignIn()}>
                      Get Creator
                    </button>
                  </div>
                ) : (
                  <div className={styles.cardAction}>
                    <form action="/api/checkout_sessions" method="POST">
                      <input type="hidden" name="tipo" value={subsTplan} />
                      <button
                        type="submit"
                        onClick={handleSubsStarterCreatorClick}
                      >
                        Get Creator
                      </button>
                    </form>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className={styles.cardTitle}>
                  <h3>subscribed</h3>
                </div>
              </>
            )}
          </div>
        </div>

        <Snackbar
          autoHideDuration={3000}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={openSuccess}
          variant="soft"
          color="success"
          onClose={() => setOpenSuccess(false)}
        >
          {message}
        </Snackbar>
        <Snackbar
          autoHideDuration={2500}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={openDanger}
          variant="soft"
          color="danger"
          onClose={() => setOpenDanger(false)}
        >
          {message}
        </Snackbar>
      </main>
      <Footer />
    </div>
  );
};

export default Home;