import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import constants from 'utils/constants';
import InfoCard from './InfoCard';
import SynchCard from './SynchCard';
import WalletSyncCard from './WalletSyncCard';
import LoaderLogo from '../../common/ErgoLoader/index';

const getWalletStatus = (isWalletInitialized) => {
  if (!isWalletInitialized) {
    return 'Not initialized';
  }

  return 'Initialized';
};

const DashboardView = ({
  error,
  nodeInfo,
  isWalletInitialized,
  walletStatusData,
  walletBalanceData,
  ergPrice,
}) => {
  if (error !== null) {
    return (
      <>
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
          <h3 className="text-danger">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            &nbsp;
            {error}
          </h3>
        </div>
      </>
    );
  }

  if (nodeInfo === null) {
    return (
      <>
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
          <LoaderLogo />
        </div>
      </>
    );
  }

  const {
    network,
    peersCount,
    bestHeaderId,
    launchTime,
    headersHeight,
    fullHeight,
    maxPeerHeight,
    appVersion,
    isMining,
  } = nodeInfo;

  const syncStage = fullHeight === null ? 'header' : 'block';

  let progress = null;

  if (fullHeight === null) {
    if (maxPeerHeight !== null) {
      progress = ((headersHeight / maxPeerHeight) * 100).toFixed(2);
    }
  } else {
    progress = ((fullHeight / headersHeight) * 100).toFixed(2);
  }

  const explorer = `https://${
    network === 'mainnet' ? 'explorer' : network
  }.ergoplatform.com/en/blocks/${bestHeaderId}`;

  return (
    <>
      <div className="dashboard">
        <h2 className="dashboard__title">Node Information</h2>
        <div className="dashboard__container row">
          <div className="col-lg-3 col-md-4 col-6 dashboard__item">
            <InfoCard className="card rounded-0 shadow-none">
              <p className="info-card__title">Version</p>
              <p className="info-card__label">{appVersion}</p>
            </InfoCard>
          </div>
          <div className="col-lg-3 col-md-4 col-6 dashboard__item">
            <SynchCard nodeInfo={nodeInfo} />
          </div>
          <div className="col-lg-3 col-md-4 col-6 dashboard__item">
            <InfoCard className="rounded-0 shadow-none">
              <p className="info-card__title">Started at</p>
              <p className="info-card__label">
                {format(new Date(launchTime), 'MM-dd-yyyy HH:mm:ss')}
              </p>
            </InfoCard>
          </div>
          {fullHeight === null ? null : (
            <div className="col-lg-3 col-md-4 col-6 dashboard__item">
              <InfoCard className="rounded-0 shadow-none">
                <p className="info-card__title">Current height</p>
                <p className="info-card__label">{fullHeight}</p>
              </InfoCard>
            </div>
          )}
          {bestHeaderId === null ? null : (
            <div className="col-lg-3 col-md-4 col-6 dashboard__item">
              <InfoCard className="rounded-0 shadow-none">
                <p className="info-card__title">Best block id</p>
                <p className="info-card__label">
                  <a href={explorer} target="_blank" rel="noopener noreferrer">
                    {bestHeaderId}
                  </a>
                </p>
              </InfoCard>
            </div>
          )}
          <div className="col-lg-3 col-md-4 col-6 dashboard__item">
            <InfoCard className="rounded-0 shadow-none">
              <p className="info-card__title">Mining enabled</p>
              <p className="info-card__label">{isMining ? 'Yes' : 'No'}</p>
            </InfoCard>
          </div>
          <div className="col-lg-3 col-md-4 col-6 dashboard__item">
            <InfoCard className="rounded-0 shadow-none">
              <p className="info-card__title">Peers connected</p>
              <p className="info-card__label">{peersCount}</p>
            </InfoCard>
          </div>
          {!progress || progress === 100 ? null : (
            <div className="col-lg-3 col-md-4 col-6 dashboard__item">
              <InfoCard className="rounded-0 shadow-none">
                <p className="info-card__title">Sync progress</p>
                <p className="info-card__label">
                  Syncing {syncStage}s: {`${progress > 100 ? '--' : progress}%`}
                </p>
                <span
                  className="info-card__progress"
                  style={{
                    background: `linear-gradient(90deg, var(--${syncStage}) ${
                      progress > 100 ? 0 : progress
                    }%, black 0%)`,
                  }}
                />
              </InfoCard>
            </div>
          )}
        </div>
      </div>

      {ergPrice && (
        <div className="dashboard">
          <h2 className="dashboard__title">ERG Information</h2>
          <div className="dashboard__container row">
            <div className="col-lg-3 col-md-4 col-6 dashboard__item">
              <InfoCard className="rounded-0 shadow-none">
                <p className="info-card__title">
                  ERG price in $ <br />
                  (based on oracle pool data)
                </p>
                <p className="info-card__label">{ergPrice}</p>
              </InfoCard>
            </div>
          </div>
        </div>
      )}

      {walletStatusData && (
        <div className="dashboard">
          <h2 className="dashboard__title">Wallet Information</h2>
          <div className="dashboard__container row">
            <div className="col-lg-3 col-md-4 col-6 dashboard__item">
              <InfoCard className="rounded-0 shadow-none">
                <p className="info-card__title">Initialization state</p>
                <p className="info-card__label">{getWalletStatus(isWalletInitialized)}</p>
              </InfoCard>
            </div>
            <div className="col-lg-3 col-md-4 col-6 dashboard__item">
              <InfoCard className="rounded-0 shadow-none">
                <p className="info-card__title">Lock state</p>
                <p className="info-card__label">
                  {walletStatusData.isUnlocked ? 'Unlocked' : 'Locked'}
                </p>
              </InfoCard>
            </div>
            <div className="col-lg-3 col-md-4 col-6 dashboard__item">
              <WalletSyncCard
                walletStatusData={walletStatusData}
                headersHeight={nodeInfo.headersHeight}
              />
            </div>
            {walletBalanceData && (
              <div className="col-lg-3 col-md-4 col-6 dashboard__item">
                <InfoCard className="rounded-0 shadow-none">
                  <p className="info-card__title">Balance</p>
                  <p className="info-card__label">
                    {walletBalanceData.balance / constants.nanoErgInErg} ERG{' '}
                    {ergPrice &&
                      `~ $${Number(
                        ergPrice * (walletBalanceData.balance / constants.nanoErgInErg),
                      ).toFixed(2)}`}
                  </p>
                </InfoCard>
              </div>
            )}
            {walletBalanceData && (
              <div className="col-lg-3 col-md-4 col-6 dashboard__item">
                <InfoCard className="rounded-0 shadow-none">
                  <p className="info-card__title">Assets</p>
                  <p className="info-card__label">
                    {Object.values(walletBalanceData.assets).length || '0'}
                  </p>
                </InfoCard>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardView;
