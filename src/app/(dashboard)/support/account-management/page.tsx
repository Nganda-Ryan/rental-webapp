"use client"
import React, { useEffect, useState } from 'react';
import {
  Search,
  Mail,
  UserPlus,
  Phone,
  Trash2,
  UserX,
  UserCheck,
} from 'lucide-react';
import { NewSupportUserForm } from '@/components/feature/Support/NewSupportUserForm'; 
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import Overlay from '@/components/Overlay';
import { AllRole, FormValues, ICreateUserParam, IUser, ManagerRole, SeachUserParams, UserStatus } from '@/types/user';
import { CLIENT_PROFILES, PROFILE_MANAGER, USERS_STATUS } from '@/constant';
import { createUser, searchUser } from '@/actions/userAction';
import { getRoleBadge, getStatusIcon } from '@/lib/utils-component';
import { ResponsiveTable } from '@/components/feature/Support/ResponsiveTable';
import Nodata from '@/components/error/Nodata';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { SuccessModal } from '@/components/Modal/SucessModal';
import Loading from '@/components/error/Loading';




const SupportUsers = () => {
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [userList, setUserList] = useState<IUser[]>([]);
  const [selectedRole, setSelectedRole] = useState<AllRole>('ALL');
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>('ALL')
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const router = useRouter();

  useEffect(() => {

    getUserList();
  }, []);

  const getUserList = async () => {
    try {
      setIsFetchingUser(true);
      const payload: SeachUserParams = {
        orderBy: "U.NIU",
        term: "",
        orderMode: 'desc',
        offset: 0,
        limit: 1000,
        page: 1,
      } 

      const result = await searchUser(payload);
      if(result.data){
        const rawItems = (result.data.body.items ?? []) as any[];
        const usersByCode = rawItems.reduce((acc: Record<string, IUser>, item: any) => {
          const code = item.UserCode;

          if (!acc[code]) {
            acc[code] = {
              id: item.user.Code,
              profileId: code,
              firstName: item.user.Firstname,
              lastName: item.user.Lastname,
              email: item.user.Email,
              phone: item.user.Phone,
              profile: [item.RoleCode],
              gender: item.user.Gender,
              city: item.user.Address.City,
              street: item.user.Address.Street,
              country: item.user.Address.Country,
              avatarUrl: item.user.AvatarUrl,
              status: item.user.Status,
              NIU: item.user.NIU,
            };
          } else {
            if (!acc[code].profile.includes(item.RoleCode)) {
              acc[code].profile.push(item.RoleCode);
            }
          }

          return acc;
        }, {});

        console.log('-->usersByCode', usersByCode);
        let _userList = Object.values(usersByCode);
        _userList = _userList.filter((item: IUser) => !item.profile.includes("ADMIN") || !item.profile.includes("SUPPORT"));
        setUserList(_userList);
  
      
      } else if(result.error){
        if(result.code == 'SESSION_EXPIRED'){
            router.push('/signin');
            return;
        }
        toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
      }
    } catch (error) {
      console.log('SupportUsers.getUserList.error', error);
      toast.error("Something went wrong during the process. Try again or contact the administrator", { position: 'bottom-right' });
    } finally {
      setIsFetchingUser(false);
    }
    

  }

  

  
  // const filteredUsers = userList.filter((user) => selectedRole === 'ALL' || user.profile.includes(selectedRole))
  
  const usersTableColumn = [
    {
      key: 'userId',
      label: 'USER',
      priority: "medium" as "medium",
      render: (_: any, user: IUser) => (
          <div className="text-gray-800 text-sm dark:text-gray-100">
            <div className="font-bold">{user.lastName} {user.firstName}</div>
            <div>NUI : {user.NIU}</div>
          </div>
      ),
    },
    {
      key: 'contact',
      label: 'CONTACT',
      priority: "medium" as "medium",
      render: (_: any, user: IUser) => (
      <div className="text-sm sm:text-base text-gray-800 dark:text-gray-100">
        <div className="flex flex-row flex-nowrap items-center gap-2 sm:justify-start justify-end">
          <Mail size={14} /> {user.email}
        </div>
        <div className="flex flex-row flex-nowrap items-center gap-2 sm:justify-start justify-end">
          <Phone size={14} /> {user.phone}
        </div>
      </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      priority: "medium" as "medium",
      render: (_: any, user: IUser) => (
      <span className="text-sm text-gray-800 dark:text-gray-100">
        {user.profile.map(role => (<span key={role} className='px-0.5'>{getRoleBadge(role)}</span>))}
      </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      priority: "medium" as "medium",
      render: (_: any, user: IUser) => (
      <span className="text-sm text-gray-800 dark:text-gray-100">
        {getStatusIcon(user.status)}
      </span>
      ),
    },
    {
        key: 'actions',
        label: 'Actions',
        priority: "high" as "high",
        render: (_: any, user: IUser) => (
        <div className="flex gap-2">
          {user.status === 'ACTIVE' ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDesactivateUser(user);
              }}
              title="Desactivate the user"
              className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 flex-nowrap"
            >
              <UserX size={16} />
              Deactivate
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleActivateUser(user);
              }}
              title="Activate the user"
              className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1"
            >
              <UserCheck size={16} />
              Activate
            </button>
          )}
        </div>

        ),
    },
  ]

  const handleDesactivateUser = async (user: IUser) => {
    console.log("-->handleDesactivateUser.user", user);
  }


  const handleActivateUser = async (user: IUser) => {
    console.log("-->handleActivateUser.user", user);
  }

  const handleSelectUSer = (userId: IUser) => {
    console.log('handleSelectUSer.userId', userId);
    // router.push(`/support/account-management/${userId}`)
  }
  const handleNewUserSubmit = async (data: FormValues) => {
    console.log('New support user data:', data.country)
    try {
      const payload: ICreateUserParam = {
        "email": data.email,
        "phone": data.phone,
        "gender": data.gender,
        "lastname": data.lastName,
        "firstname":data.firstName,
        "password": data.password,
        "role": data.role,
        "addressData": {
          city: data.city,
          street: data.street,
          country: data.country
        }
      }
      const result = await createUser(payload);

      if(result?.data){
        setSuccessMessage("Admin created successfully");
        setShowSuccessModal(true)
      } else if (result?.error) {
        console.log('SupportUser.handleNewUser.result.error', result.error);
        toast.error(result.error ?? "An unexpected error occurred", { position: 'bottom-right' });
      }
    } catch (error) {
      console.log("SupportUser.handleNewUser.error", error);
      toast.error("Something went wrong during the process. Try again or contact the administrator", { position: 'bottom-right' });
    } finally {
      if(showSuccessModal){
        await getUserList();
      }
      setShowNewUserForm(false);
    }
    

    
  };


  return (
    <DefaultLayout>
      <Breadcrumb previousPage={false} pageName="Account Management" />

        <div className="w-full">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg"
            value={selectedRole}
            onChange={(e) => setSelectedRole((e.target.value as any))}
          >
            {
              CLIENT_PROFILES.map(profile => (
                <option key={profile.value} value={profile.value}>{profile.label}</option>
              ))
            }
          </select>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg"
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as UserStatus)
            }
          >
            {
              USERS_STATUS.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))
            }
          </select>
        </div>


          <div className="bg-transparent md:bg-white md:dark:bg-gray-800 rounded-lg md:shadow-sm overflow-hidden">
            {
              !isFetchingUser ? 
                userList.length > 0 && isFetchingUser == false ? (
                  <ResponsiveTable
                    columns={usersTableColumn}
                    data={userList.slice(0, 100)}
                    onRowClick={(user: IUser) => handleSelectUSer(user)}
                    keyField="id"
                    paginate={10}
                  />
                  ) : (
                  <Nodata message="No user to display" />
                )
                : 
              <Loading />
            }
          </div>
          


          <Overlay isOpen={showNewUserForm} onClose={() => setShowNewUserForm(false)}>
            <NewSupportUserForm
                isOpen={showNewUserForm}
                onClose={() => setShowNewUserForm(false)}
                onSubmit={handleNewUserSubmit}
              />
          </Overlay>
          <Overlay isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
            <SuccessModal
                onClose={() => setShowSuccessModal(false)}
                message={successMessage}
            />
          </Overlay>
        </div>
    </DefaultLayout>
  )
}

export default SupportUsers;
