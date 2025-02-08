import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

interface paramsInterface {
	params: {
		id: string;
	}
}

export async function GET({ params }: paramsInterface) {
	const id = (await params).id;
	await connectToDatabase();
	try {
		const product = await Product.findById(id);
		return NextResponse.json({ data: product });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

export async function DELETE({ params }: paramsInterface) {
	const id = (await params).id;
	await connectToDatabase();
	try {
		const deletedProduct = await Product.findByIdAndDelete(id);
		return NextResponse.json({ data: deletedProduct });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

export async function PATCH(req: NextRequest, { params }: paramsInterface) {
	const id = (await params).id;
	await connectToDatabase();
	try {
		const body = await req.json();
		const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });
		return NextResponse.json({ data: updatedProduct });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}