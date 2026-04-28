import { loadStripe } from '@stripe/stripe-js';

// This is Stripe's official public test key. 
// You can replace this with your own Test Public Key from your Stripe Dashboard later.
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

export default stripePromise;
