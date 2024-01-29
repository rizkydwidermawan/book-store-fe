import { Box, Heading, Text, Button, VStack, Stack } from '@chakra-ui/react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Link as BuenLink } from 'react-router-dom';
import { checkoutCart, getCart } from '../../redux/actions';

const KEY =
	'pk_test_51OdXLvDKkDaw6rlBx0JGybD5vN9IpUm0RisRtEZbuKIhQ5eTVQRGiDBBsZPrxePBQKgxPULmzn1Iqs0DinoCU1Ak00ErNFu1Ki';
export default function Pay() {
	const dispatch = useDispatch();
	const history = useHistory();
	const [stripeToken, setStripeToken] = useState(null);
	const { summary, userName, userProfilePicture, userId, token } =
		useSelector((state) => state);

	let total = Math.trunc(summary.toFixed(2) * 100);

	const onToken = (token) => {
		setStripeToken(token);
	};

	useEffect(() => {
		const makeRequest = async () => {
			try {
				const res = await axios.post('/payment/create', {
					tokenId: stripeToken.id,
					amount: total,
				});
				history.push('/success', {
					data: res.data,
				});
				dispatch(checkoutCart(userId, token));
				console.log(res.data);
			} catch (err) {
				history.push('/error');
				console.log(err);
			}
		};
		stripeToken && makeRequest();
	}, [stripeToken]);

	return (
		<VStack
			justify={'space-evenly'}
			textAlign='center'
			py={10}
			px={6}
			pt='24'
			h='90vh'>
			<Heading
				display='inline-block'
				as='h2'
				size='2xl'
				bgGradient='linear(to-r, blue.600, blue.400)'
				backgroundClip='text'>
				Your purchase is ready
			</Heading>
			{
			}
			<Stack
				w={{ base: '100%', sm: '70%', md: '50%', lg: '30%' }}
				rounded={'5px'}
				p={'10px'}
				shadow={'black 0 0 15px'}
				border={'solid 1px gray'}>
				<Text fontSize={'20px'} color={'gray.500'} mb={6}>
					Your total is: US${summary.toFixed(2)}
				</Text>
				<StripeCheckout
					name={userName}
					image={userProfilePicture}
					description={`Your total is ${summary}`}
					amount={total}
					token={onToken}
					stripeKey={KEY}>
					<Button
						p={'30px'}
						bgGradient='linear(to-r, blue.600, blue.400)'
						color={'whiteAlpha.700'}
						_hover={{
							bgGradient: 'linear(to-r, blue.400, blue.600)',
							color: 'black',
						}}>
						<Text fontSize='18px' mt={3} mb={2}>
							Click here to buy
						</Text>
					</Button>
				</StripeCheckout>
			</Stack>
			<BuenLink to='/'>
				<Button
					bgGradient='linear(to-r, blue.400, blue.600)'
					color={'whiteAlpha.700'}
					_hover={{
						bgGradient: 'linear(to-r, blue.600, blue.400)',
						color: 'black',
					}}
					variant='solid'>
					Back to BookStore
				</Button>
			</BuenLink>
		</VStack>
	);
}
