import _ from 'lodash';
import { CreditCard, DefaultTransaction, Pix, Ticket } from "@src/service/transaction-types";
import { cards, pixs, tickets } from "@src/service/constants";

export class TransactionConsumer {

	parseToJSON(payload: string): object {
		try {
			return JSON.parse(payload)
		} catch (e: any) {
			return {}
		}

	}

	checkObjectKeys(payload: object): boolean {
		const mustContains = [
			'transaction-id',
			'payment-method',
			'payment-info',
			'user-id',
			'transaction-cart',
			'created-at'
		]

		const objKeys = Object.keys(payload)

		if (!objKeys.length) {
			return false
		}

		return mustContains.every(k => objKeys.includes(k))
	}

	identifyPaymentMethod(payload: DefaultTransaction<any>) {
		const paymentInfo = payload['payment-info']

		if (_.has(paymentInfo, 'card_number')) {
			return 'credit_card'
		}

		if (_.has(paymentInfo, 'ticket_no')) {
			return 'ticket'
		}

		return 'pix'
	}

	transactionResult(payload: DefaultTransaction<CreditCard>) {
		let type = 'expired'
		if (cards.has('approved')) {
			type = _.identity(payload["payment-info"]) === cards.get('approved') ? 'approved' : 'expired';
		}

		if (cards.has('analysing')) {
			type = _.identity(payload["payment-info"]) === cards.get('analysing') ? 'analysing' : 'expired';
		}

		return type
	}

	isValidTicket(payload: DefaultTransaction<Ticket>) {
		if (tickets.has('approved')) {
			return _.identity(payload['payment-info']) === tickets.get('approved')
		}

		if (tickets.has('expired')) {
			return _.identity(payload['payment-info']) === tickets.get('expired')
		}

		return false
	}

	isValidPix(payload: DefaultTransaction<Pix>) {
		if (pixs.has('approved')) {
			return _.identity(payload['payment-info']) === pixs.get('approved')
		}

		if (pixs.has('expired')) {
			return _.identity(payload['payment-info']) === pixs.get('expired')
		}

		return false
	}

}