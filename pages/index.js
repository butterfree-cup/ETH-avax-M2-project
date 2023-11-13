import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [formType, setFormType] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [numberInput, setNumberInput] = useState("");
  const [factorialResult, setFactorialResult] = useState(false);
  const [result, setResult] = useState("");
  const [newOwnerAddress, setNewOwnerAddress] = useState("");

  const alignment = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const styles = {
    main: {
      margin: 0,
      padding: '20px',
      width: '100',
      textAlign: 'center',
      ...alignment,
      fontFamily: 'Lucida Console, Arial, sans-serif'
    },
    header: {
      margin: 0,
      color: "#f6f8f6",
      fontSize: 25
    },
    bodyContainer:{
      width: '100%',
      ...alignment,
      gap: 30

    },
    body: {
      backgroundColor: "#5c536a",
      width: '50%',
      ...alignment,
      padding: 20,
      color: "#f6f8f6",
      fontSize: 20,
      borderRadius: 10
    },
    buttonContainer: {
      display: 'flex',      
      alignContent: 'space-between',
      gap: 15
    },
    buttonPrimary: {
      backgroundColor: "#f6f8f6",
      fontFamily: 'Lucida Console, Arial, sans-serif',
      padding: 10,
      fontSize: 15,
      fontWeight: 'bold'
    },
    buttonSecondary: {
      backgroundColor: "#f6f8f6",
      fontFamily: 'Lucida Console, Arial, sans-serif',
      padding: 10,
    },
    form: {
      backgroundColor: "#6a5c53",
      width: '100%',
      padding: 10,
      borderRadius: 10,
      color: "#f6f8f6",
      ...alignment,
      alignContent: 'space-between',
      gap: 10,
      textAlign: 'center'
    },
    subtext: {
      ...alignment,
      fontFamily: 'Lucida Console, Arial, sans-serif',
      fontSize: 20
    }
  };
  

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account && account.length > 0) {
      const activeAccount = account[0];
      console.log("Account connected: ", activeAccount);
      setAccount(activeAccount);
    } else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      try{
        let tx = await atm.deposit(depositAmount);
        await tx.wait()
        getBalance();
      } catch (error){
          alert("Deposit unsuccessful!");
      }

    }
  }

  const withdraw = async() => {
    if (atm) {
      try{
        let tx = await atm.withdraw(withdrawAmount);
        await tx.wait()
        getBalance();
      } catch (error){
        alert("Withdraw unsuccessful!")
      }

    }
  }
  
  const calculateFactorial = async () => {
    if (atm){ 
      try{
          setResult((await atm.calculateFactorial(numberInput)).toNumber());
          setFactorialResult(true);
        
      } catch (error){
        alert("Error calculating factorial:", error.message);
      }
    }
  };

  const changeOwner = async () => {
    if (atm) {
      try {
        let tx = await atm.changeOwner(newOwnerAddress);
        await tx.wait();
        alert("Owner changed successfully");
      } catch (error) {
        alert("Error changing owner:", error.message);
      }
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button style={styles.buttonPrimary} onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div style={styles.bodyContainer}>
        <div style={styles.body}>
          <p>Your Account: {account}</p>
          <p>Your Balance: {balance}</p>

        </div>
        <div style={styles.buttonContainer}>
            <button style={styles.buttonPrimary} onClick={() => setFormType("withdraw")}>Withdraw</button>
            <button style={styles.buttonPrimary} onClick={() => setFormType("deposit")}>Deposit</button>
            <button style={styles.buttonPrimary} onClick={() => setFormType("showContactAddress")}>Contract Address</button>
            <button style={styles.buttonPrimary} onClick={() => setFormType("changeOwner")}>Change Owner</button>
            <button style={styles.buttonPrimary} onClick={() => setFormType("calculateFactorial")}>Get Factorial</button>
          </div>

          <div className="form">
            {renderForm()}
          </div>
      </div>
    );
  }

  const renderForm = () => {
    const formStyle = {

    };
    switch (formType) {
      case "withdraw":
        return (
          <div style={styles.form}>
            <p>Enter amount to withdraw:</p>
            <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)}/>
            <button style={styles.buttonSecondary} onClick={withdraw}>Submit</button>
          </div>
        );
      case "deposit":
        return (
          <div style={styles.form}>
            <p>Enter amount to deposit:</p>
            <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)}/>
            <button style={styles.buttonSecondary} onClick={deposit}>Submit</button>
          </div>
        );
      case "calculateFactorial":
        return (
          <div style={styles.form}>
            <p>Enter a number below 21: </p>
              <input
                type="number"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
              />
            <button style={styles.buttonSecondary} onClick={calculateFactorial} >Calculate</button>
            {factorialResult && <p style={styles.subtext}>Result: {result}</p>}

          </div>
        );
        case "showContactAddress":
          return (
            <div style={styles.form}>
              <p>The address for this contract is {contractAddress}.</p>
            </div>
        );
        case "changeOwner":
          return (
            <div style={styles.form}>
              <p>New owner address:</p>
              <input
                type="text"
                value={newOwnerAddress}
                onChange={(e) => setNewOwnerAddress(e.target.value)}
              />
              <button style={styles.buttonSecondary} onClick={changeOwner} >Change</button>
            </div>
        );
    }
  };

  useEffect(() => {getWallet();}, []);
  useEffect(() => {document.body.style.backgroundColor = "#141a16"})

  return (
    <main style={styles.main}>
      <header style={styles.header}><h1>ExtraSimple ATM</h1></header>
      {initUser()}
    </main>
  )
}
