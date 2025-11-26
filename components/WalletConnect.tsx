"use client";

import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown, 
  WalletDropdownDisconnect 
} from "@coinbase/onchainkit/wallet";
import { 
  Address, 
  Avatar, 
  Name, 
  Identity 
} from "@coinbase/onchainkit/identity";

export function WalletConnect() {
  return (
    <div className="flex flex-col items-center">
      <Wallet>
        <ConnectWallet 
          className="!bg-gradient-to-r !from-flame-500 !via-ember-500 !to-flame-600 
                     !text-white !font-display !font-semibold !px-8 !py-4 !rounded-xl
                     !border-0 !shadow-glow hover:!shadow-glow-lg
                     !transition-all !duration-300 hover:!scale-[1.02] active:!scale-[0.98]"
        />
        <WalletDropdown className="!bg-charcoal-900 !border-charcoal-800 !rounded-xl !shadow-xl">
          <Identity 
            className="!px-4 !pt-3 !pb-2 !bg-charcoal-800/50" 
            hasCopyAddressOnClick
          >
            <Avatar className="!rounded-lg" />
            <Name className="!text-charcoal-100 !font-display" />
            <Address className="!text-charcoal-400 !font-mono !text-sm" />
          </Identity>
          <WalletDropdownDisconnect className="!text-ember-400 hover:!bg-ember-500/10 !rounded-lg !mx-2 !mb-2" />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}


