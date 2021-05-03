import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import { Router } from '../routes';
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
  NetworkType,
  BeaconEvent,
  defaultEventCallbacks
} from "@airgap/beacon-sdk";
import { TezosToolkit } from '@taquito/taquito';

class ContributeForm extends Component {
  state = {
    value: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();



    this.setState({ loading: true, errorMessage: '' });

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
      const op = await contract.methods.donate(this.props.address).send({mutez:true,amount:this.state.value});
      await op.confirmation();


      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: '' });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
            label="Mutez"
            labelPosition="right"
          />
        </Form.Field>

        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button primary loading={this.state.loading}>
          Contribute!
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
