import prisma from "../../../shared/prisma";
import QueryBuilder from "../../../helpars/queryBuilder";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const createDocument = async (data: any) => {

//if you wanna add logic here
    const result = await prisma.document.create({ data });
    return result;
};

const getAllDocuments = async (query: Record<string, any>) => {
    const queryBuilder = new QueryBuilder(prisma.document, query);
    const documents = await queryBuilder
        .search([""])
        .filter()
        .sort()
        .paginate()
        .fields()
        .execute()

    const meta = await queryBuilder.countTotal();
    return { meta, data: documents };
};

const getSingleDocument = async (id: string) => {
    const result = await prisma.document.findUnique({ where: { id } });
    if(!result){
     throw new ApiError(httpStatus.NOT_FOUND, "Document not found..!!")
    }
    return result;
};

const updateDocument = async (id: string, data: any) => {
    const existingDocument = await prisma.document.findUnique({ where: { id } });
    if (!existingDocument) {
        throw new ApiError(httpStatus.NOT_FOUND, "Document not found..!!");
    }
    const result = await prisma.document.update({ where: { id }, data });
    return result;
};

const deleteDocument = async (id: string) => {
 const existingDocument = await prisma.document.findUnique({ where: { id } });
    if (!existingDocument) {
        throw new ApiError(httpStatus.NOT_FOUND, "Document not found..!!");
    }
    const result = await prisma.document.delete({ where: { id } });
    return null;
};

export const documentService = {
    createDocument,
    getAllDocuments,
    getSingleDocument,
    updateDocument,
    deleteDocument,
};
