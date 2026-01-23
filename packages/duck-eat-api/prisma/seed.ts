import type { PaymentMethodCreateInput } from "@/generated/prisma/models";
import { prisma } from "@/lib/db/prisma";

const companyTags = ["Bar e Restaurante", "Restaurante"];
const paymentMethods: PaymentMethodCreateInput[] = [
	{
		name: "Dinheiro",
		tag: "money",
	},
	{
		name: "Cartão de crédito",
		tag: "credit_card",
	},
	{
		name: "Pix",
		tag: "pix",
	},
];

export async function main() {
	for (const companyTag of companyTags) {
		const checkExistingCompanyTag = await prisma.companyTag.count({
			where: {
				name: companyTag,
			},
		});

		if (!checkExistingCompanyTag) {
			await prisma.companyTag.create({
				data: {
					name: companyTag,
				},
			});
		}
	}

	for (const paymentMethod of paymentMethods) {
		await prisma.paymentMethod.upsert({
			where: {
				tag: paymentMethod.tag,
			},
			create: {
				name: paymentMethod.name,
				tag: paymentMethod.tag,
			},
			update: {
				name: paymentMethod.name,
				tag: paymentMethod.tag,
			},
		});
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (err) => {
		console.error(err);
		await prisma.$disconnect();
		process.exit(1);
	});
