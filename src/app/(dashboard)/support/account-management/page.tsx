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
import { CLIENT_PROFILE_OBJ_LIST, MOBILE_DATA_STYLE_BOLD, MOBILE_DATA_STYLE_NORMAL, MANAGER_PROFILE_OBJ_LIST, USERS_STATUS } from '@/constant';
import { createUser, searchUser } from '@/actions/userAction';
import { getRoleBadge, getStatusBadge } from '@/lib/utils-component';
import { ResponsiveTable } from '@/components/feature/Support/ResponsiveTable';
import Nodata from '@/components/error/Nodata';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { SuccessModal } from '@/components/Modal/SucessModal';
import Loading from '@/components/error/Loading';
import { SkeletonTable } from '@/components/skeleton/SkeletonTable';
import Button from '@/components/ui/Button';




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
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <div className="font-medium">{user.lastName} {user.firstName}</div>
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
        <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center justify-end md:justify-start gap-1">
          <Mail size={14} /> {user.email}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-300 flex items-center justify-end md:justify-start gap-1">
          <Phone size={14} /> {user.phone}
        </div>
      </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      priority: "low" as "low",
      render: (_: any, user: IUser) => (
        <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center justify-end md:justify-start gap-1">
          {user.profile.map(role => (<span key={role} className='px-0.5'>{getRoleBadge(role)}</span>))}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      priority: "medium" as "medium",
      render: (_: any, user: IUser) => (
        <span className="text-sm text-gray-500 dark:text-gray-300 flex items-center justify-end md:justify-start gap-1">
          {getStatusBadge(user.status)}
        </span>
      ),
    },
    {
        key: 'actions',
        label: 'Actions',
        priority: "high" as "high",
        render: (_: any, user: IUser) => (
        <div className="flex items-center justify-end md:justify-start gap-2">
          {user.status === 'ACTIVE' ? (
            <Button onClick={(e) => { e.stopPropagation(); handleDesactivateUser(user);}} variant='outline-danger' disable={false} isSubmitBtn={false} fullWidth={false}>
              <UserX size={16} />
              Deactivate
            </Button>
          ) : (
            <Button onClick={(e) => { e.stopPropagation(); handleActivateUser(user);}} variant='outline-success' disable={false} isSubmitBtn={false} fullWidth={false}>
              <UserCheck size={16} />
              Activate
            </Button>
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
          <div className="flex flex-col sm:flex-row gap-4 mb-2 md:mb-7">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={20}
              />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <select
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
              >
                {CLIENT_PROFILE_OBJ_LIST.map((profile) => (
                  <option key={profile.value} value={profile.value}>
                    {profile.label}
                  </option>
                ))}
              </select>
              <select
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as UserStatus)}
              >
                {USERS_STATUS.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>



          <div className="bg-transparent md:bg-white md:dark:bg-gray-800 rounded-lg md:shadow-sm overflow-hidden mb-5">
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
              <SkeletonTable rows={6} />
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
