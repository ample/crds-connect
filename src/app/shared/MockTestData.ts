import { Address, Category, GeoCoordinates, Group, Participant, PinSearchResultsDto, Pin } from '../models';
export class MockTestData {

    public static getAPinSearchResults(numPins: number = 1, lat: number = 123, long: number = 123, designatorStart: number = 1,
    hostStatus: number = 3, pinType: number = 1, numParticipantsInGathering: number = 5,
    proximity = 5): PinSearchResultsDto {
        let pins: Pin[];
        pins = new Array<Pin>();

        for (let pin = 0; pin < numPins; pin++) {
            pins.push(this.getAPin(pin + designatorStart, hostStatus, pinType, numParticipantsInGathering, proximity));
        }
        return new PinSearchResultsDto(
            new GeoCoordinates(
                lat,
                long
            ),
            pins
        );
    }

    public static getAPinSearchResultsGatheringHost(numPins: number = 1, lat: number = 123, long: number = 123, designatorStart: number = 1,
    hostStatus: number = 3, pinType: number = 2, numParticipantsInGathering: number = 5,
    proximity = 5): PinSearchResultsDto {
        let pins: Pin[];
        pins = new Array<Pin>();

        for (let pin = 0; pin < numPins; pin++) {
            pins.push(this.getAPin(pin + designatorStart, hostStatus, pinType, numParticipantsInGathering, proximity));
        }
        return new PinSearchResultsDto(
            new GeoCoordinates(
                lat,
                long
            ),
            pins
        );
    }

    public static getAPin(designator: number = 1, hostStatus: number = 3, pinType: number = 1,
    numParticipantsInGathering: number = 5, proximity = 5): Pin {
        return new Pin(
            'firstName' + designator.toString(),
            'lastName' + designator.toString(),
            'email' + designator.toString() + '@address.com',
            designator,
            designator,
            this.getAnAddress(designator),
            hostStatus,
            this.getAGroup(designator, numParticipantsInGathering),
            'site' + designator.toString(),
            pinType,
            proximity,
            designator
        );
    }

    public static getAnAddress(designator: number = 1): Address {
        return new Address(
                designator,
                'addressline1' + designator.toString(),
                'addressline2' + designator.toString(),
                'city' + designator.toString(),
                'state' + designator.toString(),
                '17272',
                designator,
                designator,
                'US',
                'CountyCounty'
            );
    }

    public static getAParticipantsArray(numOfParticipants: number = 5): Participant[] {
        let participants = new Array<Participant>();
        if (numOfParticipants === 0) {
            return null;
        }
        for (let index = 0; index < numOfParticipants; index++) {
            let participant = new Participant(
                'congregation',
                index,
                'displayName' + index.toString(),
                'email' + index.toString() + '@address.com',
                index,
                1,
                'title' + index.toString(),
                true,
                'lastName' + index.toString(),
                'nickName' + index.toString(),
                index,
                new Date(2016, 5).toDateString()
            );
            participants.push(participant);
        };
        return participants;
    }

    public static getAGroup(designator: number = 1, numParticipantsInGathering: number = 5): Group {
        return new Group(
            designator,
            'groupName' + designator.toString(),
            'groupDescription' + designator.toString(),
            'Anywhere',
            1,
            1,
            'congregation' + designator.toString(),
            designator,
            designator,
            new Date(2016, 5).toDateString(),
            null,
            0,
            true,
            5,
            false,
            false,
            0,
            false,
            3,
            'meetingDay',
            'meetingTime',
            'erryday',
            3,
            this.getAnAddress(designator),
            10,
            false,
            23,
            this.getAParticipantsArray(numParticipantsInGathering),
            30
        );
    }

    public static getSomeCategories(numOfCategories: number = 5) {
        let participants = new Array<Category>();
        if (numOfCategories === 0) {
            return null;
        }
        for (let index = 0; index < numOfCategories; index++) {
            let participant = new Category(
                index,
                null,
                `Category #${index} description`,
                `Example Text #${index}`,
                false,
                `Category #${index}`
            );
            participants.push(participant);
        };
        return participants;
    }

    constructor() {}
}
