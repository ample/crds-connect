import { LookupTable } from '../models';
import { attachEmbeddedView } from '@angular/core/src/view/view_attach';

import { Address, Category, DetailedUserData, GeoCoordinates, Group, Participant, Pin, PinSearchResultsDto, AttributeType, Attribute } from '../models';
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
            new Date(2016, 5).toLocaleDateString(),
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

    public static getSomeCategories(numOfCategories: number = 5): Category[] {
        let categories = new Array<Category>();
        if (numOfCategories === 0) {
            return null;
        }
        for (let index = 0; index < numOfCategories; index++) {
            let category = new Category(
                index,
                null,
                `Category #${index} description`,
                `Example Text #${index}`,
                false,
                `Category #${index}`
            );
            categories.push(category);
        };
        return categories;
    }

    public static getADetailedUserData(designator: number = 1): DetailedUserData {
        return new DetailedUserData(
            designator,
            `firstName${designator}`,
            `lastName${designator}`,
            `${designator}112223333`,
            '3332221111',
            `email${designator}@email.com`,
            this.getAnAddress(designator)
        );
    }

    /**
     * This call with return an AttributeType object
     * That contains an array of attributes for Gender Mix Types.
     * This is mocking what the AttributeType API call returns
     */
    public static getGroupGenderMixAttributeTypeWithAttributes(): AttributeType {
        let attributes: Attribute[] = [
            new Attribute(1, 'Errbody welcome', '(errbody)', null, null, null, 0, 73, null, null),
            new Attribute(2, 'Ladies in da house', '(guuurl)', null, null, null, 1, 73, null, null),
            new Attribute(3, 'dudebros', '(bros)', null, null, null, 2, 73, null, null)
        ];
        return new AttributeType('group type', 73, false, attributes);
    }

    /**
     * This call with return an AttributeType object
     * That contains an array of attributes for age ranges.
     * This is mocking what the AttributeType API call returns
     */
    public static getAgeRangeAttributeTypeWithAttributes(): AttributeType {
        let attributes: Attribute[] = [
            <Attribute>{ attributeId: 7089, name: 'middle skool', sortOrder: 0, attributeTypeId: 91 },
            new Attribute(7090, 'High Scho', null, null, null, null, 1, 91, null, null),
            new Attribute(7091, 'College and stuff', null, null, null, null, 2, 91, null, null),
            new Attribute(7092, 'Dead', null, null, null, null, 3, 91, null, null)
        ];
        return new AttributeType('Age Range', 91, true, attributes);
    }

    public static getProfileData(designator: number = 1): any {
        let data = {
            addressId: designator * 100,
            addressLine1: '123 street place',
            addressLine2: null,
            age: 33,
            city: `City${designator}`,
            congregationId: designator,
            contactId: designator,
            dateOfBirth: '12/20/1983',
            emailAddress: `person${designator}@coolplace.com`,
            employerName: 'Coolibrity Place',
            firstName: `person${designator}`,
            foreignCountry: 'United States',
            genderId: 1,
            homePhone: '513-123-1234',
            householdId: designator * 100,
            householdName: `Household${designator}`,
            lastName: `Household${designator}`,
            maritalStatusId: 2,
            middleName: `middle${designator}`,
            mobileCarrierId: 5,
            mobilePhone: '513-321-3212',
            nickName: `CoolPerson${designator}`,
            postalCode: '45039-9731',
            county: null,
            state: 'OH',
        };
        return data;
    }

    public static getSitesList(): LookupTable[] {
        return [
            new LookupTable(1, 'oakley'),
            new LookupTable(2, 'space'),
            new LookupTable(3, 'san fran'),
            new LookupTable(4, 'trenton'),
            new LookupTable(5, 'norway'),
            new LookupTable(6, 'dragonstone')
        ];

    }

    constructor() { }
}
