import React, { useState, useCallback } from 'react';
import { Form, Field } from 'react-final-form';
import InfoModal from 'components/common/InfoModal/InfoModal';
import cn from 'classnames';
import nodeApi from '../../../../../api/api';
import customToast from '../../../../../utils/toast';
import CopyToClipboard from '../../../../common/CopyToClipboard';
import constants from '../../../../../utils/constants';

type Errors = {
  recipientAddress?: string;
  amount?: string;
  fee?: string;
};

const PaymentSendForm = ({
  apiKey,
  walletBalanceData,
}: {
  apiKey: string;
  walletBalanceData: any;
}) => {
  const [transactionId, setTransactionId] = useState(null);
  const [isSendedModalOpen, setIsSendedModalOpen] = useState(false);

  const paymentSend = useCallback(
    ({ recipientAddress, amount, fee }) =>
      nodeApi.post(
        '/wallet/payment/send',
        {
          requests: [
            {
              address: recipientAddress,
              value: Number((parseFloat(amount) * constants.nanoErgInErg).toFixed(1)),
            },
          ],
          fee: Number((parseFloat(fee) * constants.nanoErgInErg).toFixed(1)),
          inputsRaw: ['string'],
          dataInputsRaw: ['string'],
        },
        {
          headers: {
            api_key: apiKey,
          },
        },
      ),
    [apiKey],
  );

  const resetForm = (form: any) => {
    form.restart();
    setIsSendedModalOpen(false);
  };

  const sendForm = useCallback(
    (values) => {
      if (values.recipientAddress.trim() === '' || !values.recipientAddress) {
        return;
      }

      paymentSend(values)
        .then(({ data }) => {
          setTransactionId(data);
          setIsSendedModalOpen(true);
        })
        .catch((err) => {
          const errMessage = err.data ? err.data.detail : err.message;
          customToast('error', errMessage);
        });
    },
    [paymentSend],
  );

  const validateForm = useCallback((values) => {
    const errors: Errors = {};
    if (!values.recipientAddress) {
      errors.recipientAddress = 'The field cannot be empty';
    }
    if (!values.fee || values.fee < 0.001) {
      errors.fee = 'Minimum 0.001 ERG';
    }
    return errors;
  }, []);
  console.log(walletBalanceData?.assets);
  return (
    <div className="">
      <div className="card bg-white p-4">
        <h2 className="h5 mb-3">Payment send</h2>
        <Form
          onSubmit={sendForm}
          validate={validateForm}
          initialValues={{ fee: 0.001 }}
          render={({ handleSubmit, submitting, pristine, form }) => (
            <>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="recipient-address">Recipient address</label>
                  <Field
                    name="recipientAddress"
                    render={({ input, meta }) => (
                      <>
                        <input
                          id="recipient-address"
                          className={cn('form-control', {
                            'is-invalid': meta.touched && meta.error,
                          })}
                          type="text"
                          placeholder="Enter recipient address"
                          {...input}
                        />
                        <div className="invalid-feedback">{meta.error}</div>
                      </>
                    )}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="amount">Amount</label>
                  <Field
                    name="amount"
                    render={({ input, meta }) => (
                      <>
                        <input
                          id="amount"
                          className={cn('form-control', {
                            'is-invalid': meta.touched && meta.error,
                          })}
                          type="number"
                          placeholder="0.000"
                          {...input}
                        />
                        <div className="invalid-feedback">{meta.error}</div>
                      </>
                    )}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fee">Fee (in ERG)</label>
                  <Field
                    name="fee"
                    value="0.001"
                    render={({ input, meta }) => (
                      <>
                        <input
                          id="fee"
                          className={cn('form-control', {
                            'is-invalid': meta.touched && meta.error,
                          })}
                          type="number"
                          placeholder="Minimum 0.001 ERG"
                          {...input}
                        />
                        <div className="invalid-feedback">{meta.error}</div>
                      </>
                    )}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting || pristine}>
                  Send
                </button>
              </form>

              <InfoModal
                open={isSendedModalOpen}
                onClose={() => {
                  setIsSendedModalOpen(false);
                }}
                title="Payment sent"
                description={
                  <>
                    <p>
                      Your payment has been sent successfully. The transaction ID is -{' '}
                      <CopyToClipboard>{transactionId}</CopyToClipboard>
                    </p>
                    <p>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://explorer.ergoplatform.com/en/transactions/${transactionId}`}
                      >
                        Click Here To Go To The Explorer
                      </a>
                    </p>
                  </>
                }
                primaryButtonContent={<span className="pl-3 pr-3">OK</span>}
                secondaryButtonContent="Send again"
                onPrimaryHandler={() => resetForm(form)}
              />
            </>
          )}
        />
      </div>
    </div>
  );
};

export default PaymentSendForm;
