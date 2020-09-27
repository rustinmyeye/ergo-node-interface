import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faCheck } from '@fortawesome/free-solid-svg-icons';
import InfoCard from '../InfoCard';

export default class WalletSyncCard extends Component {
  renderActiveSynchronization = () => (
    <>
      <p className="info-card__title">Synchronization state</p>
      <p className="info-card__label text-warning">
        <FontAwesomeIcon icon={faSync} spin /> Active synchronization
      </p>
    </>
  );

  renderCompleteSynchronization = () => (
    <>
      <p className="info-card__title">Synchronization state</p>
      <p className="info-card__label text-success">
        <FontAwesomeIcon icon={faCheck} /> Wallet is synced
      </p>
    </>
  );

  renderSynchronizationState = (state) =>
    ({
      active: this.renderActiveSynchronization,
      complete: this.renderCompleteSynchronization,
    }[state]);

  getSynchronizationState = (walletStatusData, headersHeight) => {
    if (
      walletStatusData.walletHeight !== null &&
      headersHeight !== null &&
      walletStatusData.walletHeight === headersHeight
    ) {
      return 'complete';
    }

    return 'active';
  };

  render() {
    const { walletStatusData, headersHeight } = this.props;
    const currentSynchState = this.getSynchronizationState(walletStatusData, headersHeight);
    return (
      <InfoCard className={this.props.className}>
        {this.renderSynchronizationState(currentSynchState)()}
      </InfoCard>
    );
  }
}
