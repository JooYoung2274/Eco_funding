import * as fundingService from '../model/funding.js';
import * as userModel from '../model/user.js';
import { localFileUrl } from '../utils/image.js';
import {
    fundingUpdateValidate,
    fundingPostValidate,
    thumbnailAndImagesValidate,
} from '../utils/fundingValidate.js';
import { UpdateFundingData } from '../service/dataClass.js';

export async function getFundings(req, res, next) {
    try {
        const fundings = await fundingService.getItems();

        res.status(200).json({ ok: true, result: fundings });
    } catch (error) {
        res.sendStatus(400);
        return;
    }
}

export async function getFunding(req, res, next) {
    try {
        const itemId = req.params.itemId;
        const funding = await fundingService.getItem(itemId);
        res.status(200).json({ ok: true, result: funding });
    } catch (error) {
        res.sendStatus(400);
        return;
    }
}

export async function postFunding(req, res, next) {
    try {
        const { title, price, targetPrice, content } = fundingPostValidate(
            req.body,
        );
        const reqFiles = thumbnailAndImagesValidate(req.files);
        const thumbnail = localFileUrl(reqFiles.thumbnail[0].filename);
        const images = [];
        reqFiles.images.forEach((v) => {
            images.push(localFileUrl(v.filename));
        });
        const user = res.locals.user;
        await fundingService.createItem({
            title,
            images,
            thumbnail,
            price,
            targetPrice,
            content,
            nickname: user.nickname,
        });
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
        return;
    }
}

export async function updateFunding(req, res, next) {
    try {
        const { itemId } = req.params;
        const { title, content } = fundingUpdateValidate(req.body);
        const updateData = new UpdateFundingData(title, content, req.files);
        const user = res.locals.user;
        const funding = await fundingService.getItem(itemId);
        if (funding && funding.nickname == user.nickname) {
            try {
                await fundingService.updateItem(itemId, updateData);
                res.status(204).send();
            } catch (error) {
                console.log(error);
                res.status(400).send();
            }
        } else {
            res.status(400).send();
        }
    } catch (error) {
        console.log(error);
        res.status(400).send();
        return;
    }
}

export async function deleteFunding(req, res, next) {
    try {
        const { itemId } = req.params;
        const user = res.locals.user;
        const funding = await fundingService.getItem(itemId);
        if (funding && funding.nickname == user.nickname) {
            try {
                await fundingService.deleteItem(itemId);
                res.status(204).send();
            } catch (error) {
                console.log(error);
                res.status(400).send();
            }
        } else {
            res.status(400).send();
        }
    } catch (error) {
        console.log(error);
        res.status(400).send();
    }
}

export async function priceUpdateFunding(req, res, next) {
    try {
        const { itemId } = req.params;
        const user = res.locals.user;
        const funding = await fundingService.getItem(itemId);
        const { id, point } = user;
        const { price, totalPrice, targetPrice } = funding;
        await fundingService.priceUpdateItem(
            itemId,
            price,
            totalPrice,
            targetPrice,
        );
        await userModel.pointUpdateUser(id, point, price);
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(400).send();
    }
}

export async function getRankingFundings(req, res, next) {
    const fundings = await fundingService.getRankingItems();

    res.status(200).json({ ok: true, result: fundings });
}
