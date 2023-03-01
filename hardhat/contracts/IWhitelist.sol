// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IWhitelist {
    function whitelistedAddresses(
        address address_
    ) external view returns (bool);
}
