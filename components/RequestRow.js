import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
  NetworkType,
  BeaconEvent,
  defaultEventCallbacks
} from "@airgap/beacon-sdk";
import { TezosToolkit } from '@taquito/taquito';

class RequestRow extends Component {
  onApprove = async () => {

    try {

      const Tezos = new TezosToolkit("https://edonet.smartpy.io/");
      // await Tezos.setProvider({ signer: new TezTeigner() });

      const wallet = new BeaconWallet({
        name: "CrowdFund",
        preferredNetwork: NetworkType.EDONET,
        disableDefaultEvents: true, // Disable all events / UI. This also disables the pairing alert.
        eventHandlers: {
          // To keep the pairing alert, we have to add the following default event handlers back
          [BeaconEvent.PAIR_INIT]: {
            handler: defaultEventCallbacks.PAIR_INIT
          },
          [BeaconEvent.PAIR_SUCCESS]: {
            handler: data => setPublicToken(data.publicKey)
          }
        }
      });
      Tezos.setWalletProvider(wallet);
      await wallet.requestPermissions({
        network: {
          type: NetworkType.EDONET,
          rpcUrl: "https://edonet.smartpy.io/"
        }
      });
      // this.setState({isConnected:true});

      // gets user's address
      console.log('yes')

      let s = this.props.address;
      // console.log((s).substring(1,s.length-1));
      const contract =  await Tezos.wallet.at('KT1WMwPDPDys4qRcZbiXBLinr9XeZip3NAZV');
      console.log(this.props.id);
      console.log(this.props.address);
      const op = await contract.methods.approve(this.props.id,this.props.address).send();
      await op.confirmation();


      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }


  };

  onFinalize = async () => {
    try {

      const Tezos = new TezosToolkit("https://edonet.smartpy.io/");
      // await Tezos.setProvider({ signer: new TezTeigner() });

      const wallet = new BeaconWallet({
        name: "CrowdFund",
        preferredNetwork: NetworkType.EDONET,
        disableDefaultEvents: true, // Disable all events / UI. This also disables the pairing alert.
        eventHandlers: {
          // To keep the pairing alert, we have to add the following default event handlers back
          [BeaconEvent.PAIR_INIT]: {
            handler: defaultEventCallbacks.PAIR_INIT
          },
          [BeaconEvent.PAIR_SUCCESS]: {
            handler: data => setPublicToken(data.publicKey)
          }
        }
      });
      Tezos.setWalletProvider(wallet);
      await wallet.requestPermissions({
        network: {
          type: NetworkType.EDONET,
          rpcUrl: "https://edonet.smartpy.io/"
        }
      });
      // this.setState({isConnected:true});

      // gets user's address
      console.log('yes')

      let s = this.props.address;
      // console.log((s).substring(1,s.length-1));
      const contract =  await Tezos.wallet.at('KT1WMwPDPDys4qRcZbiXBLinr9XeZip3NAZV');
      console.log(this.props.id);
      console.log(this.props.address);
      const op = await contract.methods.finalizeRequest(this.props.id,this.props.address).send();
      await op.confirmation();


  

      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;

    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{request.value}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="teal" basic onClick={this.onFinalize}>
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
