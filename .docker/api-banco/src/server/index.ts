import express from 'express';
import { RabbitMQ } from '@src/queue/rabbit';
import { TransactionConsumer } from "@src/service/transaction-consumer";
import { CreditCard, DefaultTransaction } from "@src/service/transaction-types";
import { ProcessCreditCard } from "@src/service/process-credit-card";
import { HttpClient } from "@src/service/http-client";

const rabbitMQ = new RabbitMQ();

const app = express();
app.use(express.json());

rabbitMQ.consume(async (payload) => {
	const transaction = new TransactionConsumer();
	const httpClient = new HttpClient();

	const paymentObj = transaction.parseToJSON(payload)

	const isValidTransactionObj = transaction.checkObjectKeys(paymentObj);

	if (!isValidTransactionObj) {
		console.log("Payload de pagamento invalido")
		return;
	}

	const paymentType = transaction.identifyPaymentMethod(paymentObj as DefaultTransaction<any>);

	if (paymentType === 'credit_card') {
		const creditCardProcess = new ProcessCreditCard(
			transaction,
			httpClient,
			paymentObj as DefaultTransaction<CreditCard>
		)
		await creditCardProcess.resolveProcess()
	}

	return new Promise((resolve) => {
		resolve()
	})
})

app.listen(3000, () => {
	console.log(`RUNNING PORT 3000`)
});