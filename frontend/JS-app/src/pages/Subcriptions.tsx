import React, { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth0 } from '@auth0/auth0-react';
import '../style/Subscription.css'

const stripePromise = loadStripe('pk_test_51P1AxTEGk7e8lKhxl16I3P0CzdtxMoWc3MiP2atNyjbNcWDgQXhDq5IGyemBYlD12TtpleFG6pHjYSCSfLuVn1fc00wrvt7JSn');


export default function Subscriptions() {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [subscriptionId, setSubscriptionId] = useState('');
  

  const handleSubscriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPlan(e.target.value);
  };
  const { user } = useAuth0();
  const handleSubscribe = async () => {
    const stripe = await stripePromise; 
    const userEmail = user?.email; 

    console.log(stripe); 
    try {
      const response = await axios.post('https://jumpinghorses-examproject-4.onrender.com/api/create-checkout-session', {
        priceId: selectedPlan,  // Send the selected plan's Stripe price ID
        email: userEmail 
      
      });
      console.log(selectedPlan)
      const { id } = response.data;
      
      // Redirect the user to the Stripe Checkout page
      await stripe?.redirectToCheckout({
        sessionId: id,  // Pass the session ID from the backend
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const handleInputChange = (e:any) => {
    setSubscriptionId(e.target.value);
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await axios.post('https://jumpinghorses-examproject-4.onrender.com/api/cancel-subscription', {
        stripeSubscriptionId: subscriptionId,
      });
      alert(response.data.message); // Visa ett meddelande om att prenumerationen har satts på att avbrytas
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription');
    }
  };

  return (
    <>
    
    <div className="subscription-container">
      <h2>Select Your Subscription</h2>
      <h5>You can cancel at anytime and also upgrade to a new subsription at anytime</h5>
      <form>
        <div>
          <label>
            <input
              type="radio"
              value="price_1Pzz6AEGk7e8lKhxEtq9m3Mc"
              checked={selectedPlan === 'price_1Pzz6AEGk7e8lKhxEtq9m3Mc'}
              onChange={handleSubscriptionChange}
            />
            Bronze Plan - One ad only, 1 week
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="price_1Pzz7LEGk7e8lKhxOfaEiyJI"
              checked={selectedPlan === 'price_1Pzz7LEGk7e8lKhxOfaEiyJI'}
              onChange={handleSubscriptionChange}
            />
            Silver Plan - Unlimited ads, 1 week
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="price_1Pzz8VEGk7e8lKhxXF0u6GAo"
              checked={selectedPlan === 'price_1Pzz8VEGk7e8lKhxXF0u6GAo'}
              onChange={handleSubscriptionChange}
            />
            Gold Plan - Unlimited ads, 1 week, + extra company link + youtubelink to your video
          </label>
        </div>
        <button type="button" onClick={handleSubscribe}>Subscribe</button>
      </form>
      
      <div className="cancel-section">
        <h2>Cancel Subscription</h2>
        <input
          type="text"
          value={subscriptionId}
          onChange={handleInputChange}
          placeholder="Enter Stripe Subscription ID"
        />
        <button onClick={handleCancelSubscription}>Cancel Subscription</button>
      </div>
    </div>
    </>
  );
}