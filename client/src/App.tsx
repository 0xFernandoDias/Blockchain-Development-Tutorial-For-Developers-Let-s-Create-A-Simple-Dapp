import { useState, useEffect, FormEventHandler } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap"
import { ethers } from "ethers"

function App() {
	const [greet, setGreet] = useState<string>()
	const [balance, setBalance] = useState<string>()
	const [depositValue, setDepositValue] = useState<string>()
	const [greetingValue, setGreetingsValue] = useState<string>()

	const provider = new ethers.BrowserProvider(window.ethereum)
	const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

	const ABI = [
		{
			inputs: [
				{
					internalType: "string",
					name: "_greeting",
					type: "string",
				},
			],
			stateMutability: "nonpayable",
			type: "constructor",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: false,
					internalType: "uint256",
					name: "amount",
					type: "uint256",
				},
				{
					indexed: false,
					internalType: "uint256",
					name: "when",
					type: "uint256",
				},
			],
			name: "Withdrawal",
			type: "event",
		},
		{
			inputs: [],
			name: "deposit",
			outputs: [],
			stateMutability: "payable",
			type: "function",
		},
		{
			inputs: [],
			name: "greet",
			outputs: [
				{
					internalType: "string",
					name: "",
					type: "string",
				},
			],
			stateMutability: "view",
			type: "function",
		},
		{
			inputs: [
				{
					internalType: "string",
					name: "_greeting",
					type: "string",
				},
			],
			name: "setGreeting",
			outputs: [],
			stateMutability: "nonpayable",
			type: "function",
		},
	]

	const contractPromise = async () => {
		const signer = await provider.getSigner()
		return new ethers.Contract(contractAddress, ABI, signer)
	}

	useEffect(() => {
		const connectWallet = async () => {
			await provider.send("eth_requestAccounts", [])
		}

		const getBalance = async () => {
			const balance = await provider.getBalance(contractAddress)
			const balanceFormatted = ethers.formatEther(balance)
			setBalance(balanceFormatted)
		}

		const getGreeting = async () => {
			const contract = await contractPromise()

			const greeting = await contract.greet()
			setGreet(greeting)
		}

		connectWallet().catch((err) => console.log(err))
		getBalance().catch((err) => console.log(err))
		getGreeting().catch((err) => console.log(err))
	}, [])

	const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDepositValue(e.target.value)
	}

	const handleGreetingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setGreetingsValue(e.target.value)
	}

	const handleDepositSubmit = (e: any) => {
		e.preventDefault()
		console.log(depositValue)
	}

	const handleGreetingSubmit = async (e: any) => {
		e.preventDefault()
		const contract = await contractPromise()
		const greetingUpdate = await contract.setGreeting(greetingValue)
		await greetingUpdate.wait()
		setGreet(greetingValue)
	}

	return (
		<Container>
			<Container>
				<Row className="mt-5">
					<Col>
						<h3>{greet}</h3>
						<p>Contract balance: {balance}</p>
					</Col>
					<Col>
						<Form onSubmit={handleDepositSubmit}>
							<Form.Group className="mb-3">
								<Form.Control
									type="number"
									placeholder="0"
									onChange={handleDepositChange}
								/>
							</Form.Group>
							<Button variant="success" type="submit">
								Deposit
							</Button>
						</Form>
						<Form className="mt-5" onSubmit={handleGreetingSubmit}>
							<Form.Group className="mb-3">
								<Form.Control type="text" onChange={handleGreetingChange} />
							</Form.Group>
							<Button variant="dark" type="submit">
								Change
							</Button>
						</Form>
					</Col>
				</Row>
			</Container>
		</Container>
	)
}

export default App
