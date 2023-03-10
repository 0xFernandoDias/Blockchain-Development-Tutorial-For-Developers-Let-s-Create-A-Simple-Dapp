const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Greeter", function () {
	it("Should return the new greeting once it's changed", async function () {
		const Greeter = await ethers.getContractFactory("Greeter")
		const greeter = await Greeter.deploy("Hello, test!")
		await greeter.deployed()

		expect(await greeter.greet()).to.equal("Hello, test!")

		const setGreetingTx = await greeter.setGreeting("Hola, test!")

		await setGreetingTx.wait()

		expect(await greeter.greet()).to.equal("Hola, test!")
	})

	it("Should return the new balance after ether is deposited", async function () {
		const Greeter = await ethers.getContractFactory("Greeter")
		const greeter = await Greeter.deploy("Hello, test!")
		await greeter.deployed()

		await greeter.deposit({ value: 10 })

		expect(await ethers.provider.getBalance(greeter.address)).to.equal(10)
	})
})
