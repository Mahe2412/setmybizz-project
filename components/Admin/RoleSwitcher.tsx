"use client";

import { useState } from 'react';

export type UserRole = 'SUPER_ADMIN' | 'GST_EXPERT';

interface RoleSwitcherProps {
    currentRole: UserRole;
    onRoleChange: (role: UserRole) => void;
}

export default function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center justify-between border border-gray-200">
            <div>
                <h3 className="text-lg font-medium text-gray-900">Role Simulator</h3>
                <p className="text-sm text-gray-500">Switch roles to test access control visibility.</p>
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={() => onRoleChange('SUPER_ADMIN')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentRole === 'SUPER_ADMIN'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Super Admin
                </button>
                <button
                    onClick={() => onRoleChange('GST_EXPERT')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentRole === 'GST_EXPERT'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    GST Expert
                </button>
            </div>
        </div>
    );
}
