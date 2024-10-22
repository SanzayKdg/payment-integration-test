import dataSource from "../dataSource";
import { Items } from "../entities/item.entity";
import { faker } from "@faker-js/faker";
export async function createItems(noOfItems: number) {
  try {
    const itemsPromise = [];

    for (let i = 0; i < noOfItems; i++) {
      const tempItems: any = await dataSource.getRepository(Items).save({
        name: faker.commerce.productName(),
        price: faker.commerce.price({ min: 100, max: 1000 }),
        quantity: faker.number.int({ min: 1, max: 10 }),
        category: "Clothes",
      } as any);

      itemsPromise.push(tempItems);
    }

    await Promise.all(itemsPromise);

    console.log(noOfItems + " items created successfully");
  } catch (err: any) {
    console.log(err.message);
  } finally {
    process.exit(1);
  }
}
