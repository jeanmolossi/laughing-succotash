import { CreditCard, DefaultTransaction } from "@src/service/transaction-types";
import { TransactionConsumer } from "@src/service/transaction-consumer";
import { HttpClient, PayloadModel } from "@src/service/http-client";

export class ProcessCreditCard {
	private transaction: TransactionConsumer;
	private httpClient: HttpClient;
	private payment: DefaultTransaction<CreditCard>;

	constructor(transaction: TransactionConsumer, httpClient: HttpClient, payment: DefaultTransaction<CreditCard>) {
		this.transaction = transaction
		this.httpClient = httpClient
		this.payment = payment
	}

	async resolveProcess() {
		const transactionResult = this.transaction.transactionResult(this.payment)

		const payloadResult: PayloadModel = {
			"transaction-id": this.payment["transaction-id"],
			"updated-at": new Date().toISOString(),
			reason: "Pagamento recusado. Saldo insuficiente ou dados invalids",
			"payment-status": "cancelada"
		}

		if (transactionResult === 'approved')
			payloadResult["payment-status"] = "aprovada"

		if (transactionResult === 'analysing') {
			payloadResult["payment-status"] = "pre-aprovada"
			payloadResult.reason = "Em analise contra fraudes"
		}

		await this.httpClient.post(payloadResult)
	}

}